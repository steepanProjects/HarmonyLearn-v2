import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { config, validateProductionEnv } from "./env";

// Validate production environment configuration
validateProductionEnv();

const app = express();

// Production optimizations
if (config.app.isProduction) {
  // Trust proxy headers in production
  app.set('trust proxy', 1);
  
  // Disable x-powered-by header for security
  app.disable('x-powered-by');
}

// Request parsing middleware with size limits
app.use(express.json({ 
  limit: config.performance.bodyLimit,
  strict: true
}));
app.use(express.urlencoded({ 
  extended: false,
  limit: config.performance.bodyLimit
}));

// Timeout will be configured at server level for better safety

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error for monitoring but don't crash server in production
    console.error('Error handler caught:', err);
    
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (config.app.isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Configure server timeout for production safety
  if (config.app.isProduction) {
    server.setTimeout(config.performance.requestTimeout);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
