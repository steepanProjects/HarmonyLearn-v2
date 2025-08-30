import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import { Music, GraduationCap, Users } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export const AuthDialog = ({ open, onOpenChange, featureName = "this feature" }: AuthDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <DialogTitle>Sign In Required</DialogTitle>
          </div>
          <DialogDescription>
            You need to sign in to access {featureName}. Choose your role to get started with HarmonyLearn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-3">
            <Link to="/student-signin">
              <Button 
                className="w-full justify-start gap-3 h-12 bg-blue-500 hover:bg-blue-600"
                onClick={() => onOpenChange(false)}
              >
                <GraduationCap className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Student Portal</div>
                  <div className="text-xs opacity-90">Learn music with expert mentors</div>
                </div>
              </Button>
            </Link>
            
            <Link to="/mentor-signin">
              <Button 
                className="w-full justify-start gap-3 h-12 bg-purple-500 hover:bg-purple-600"
                onClick={() => onOpenChange(false)}
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Mentor Portal</div>
                  <div className="text-xs opacity-90">Teach and share your expertise</div>
                </div>
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/get-started" className="text-primary hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};