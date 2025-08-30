import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  className = ""
}: EmptyStateProps) => {
  return (
    <Card className={`p-12 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
        </div>
        
        {actionText && onAction && (
          <Button onClick={onAction} className="mt-4">
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};