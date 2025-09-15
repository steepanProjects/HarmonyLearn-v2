// Environment configuration for production deployment
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().optional(),
  
  // Security configuration
  SESSION_SECRET: z.string().default('fallback-secret-key-change-in-production'),
  
  // CORS configuration
  CORS_ORIGIN: z.string().default('*'),
  
  // Application configuration
  APP_NAME: z.string().default('HarmonyLearn'),
  APP_VERSION: z.string().default('1.0.0'),
  
  // Database configuration
  DATABASE_SSL: z.string().default('false'),
  DATABASE_POOL_SIZE: z.string().default('10'),
  
  // Performance configuration
  REQUEST_TIMEOUT: z.string().default('30000'),
  BODY_LIMIT: z.string().default('10mb'),
});

export type Env = z.infer<typeof envSchema>;

// Parse and validate environment variables
function parseEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment configuration:');
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Environment validation failed');
  }
}

export const env = parseEnv();

// Production configuration checks
export function validateProductionEnv(): void {
  if (env.NODE_ENV === 'production') {
    const warnings: string[] = [];
    
    if (env.SESSION_SECRET === 'fallback-secret-key-change-in-production') {
      warnings.push('SESSION_SECRET should be set to a secure random value');
    }
    
    if (env.CORS_ORIGIN === '*') {
      warnings.push('CORS_ORIGIN should be restricted to your domain in production');
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️  Production environment warnings:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  }
}

// Export configuration for easy access
export const config = {
  app: {
    name: env.APP_NAME,
    version: env.APP_VERSION,
    port: parseInt(env.PORT),
    environment: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
  },
  
  database: {
    url: env.DATABASE_URL || '',
    ssl: env.DATABASE_SSL === 'true',
    poolSize: parseInt(env.DATABASE_POOL_SIZE),
  },
  
  security: {
    sessionSecret: env.SESSION_SECRET,
    corsOrigin: env.CORS_ORIGIN,
  },
  
  performance: {
    requestTimeout: parseInt(env.REQUEST_TIMEOUT),
    bodyLimit: env.BODY_LIMIT,
  },
} as const;