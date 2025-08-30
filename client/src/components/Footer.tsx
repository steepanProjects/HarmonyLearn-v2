import { Music, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";

export const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">HarmonyLearn</span>
            </div>
            <p className="text-muted-foreground">
              Empowering musicians worldwide with quality education and a vibrant community.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</Link>
              <Link to="/mentors" className="text-muted-foreground hover:text-primary transition-colors">Mentors</Link>
              <Link to="/live-sessions" className="text-muted-foreground hover:text-primary transition-colors">Live Sessions</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>

          {/* Learning */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">Community</Link>
              <Link to="/tools" className="text-muted-foreground hover:text-primary transition-colors">Practice Tools</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@harmonylearn.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Music St, Harmony City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 HarmonyLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};