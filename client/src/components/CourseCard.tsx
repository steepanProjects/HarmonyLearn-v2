import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon, Clock, Users, DollarSign, BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { getCurrentUser, hasRole } from "@/lib/auth";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  instructor?: string;
  mentorName?: string;
  duration: number;
  level: string;
  category: string;
  price: number;
  rating?: number;
  averageRating?: number;
  students?: number;
  currentEnrollments?: number;
  maxStudents?: number;
  imageUrl?: string;
  tags?: string[];
  status?: string;
  prerequisites?: string[];
  estimatedWeeks?: number;
  difficulty?: number;
  totalRatings?: number;
  isEnrolled?: boolean;
  enrollmentProgress?: number;
  onEnroll?: (courseId: number) => void;
  onViewDetails?: (courseId: number) => void;
  onContinue?: (courseId: number) => void;
  onManage?: (courseId: number) => void;
}

export const CourseCard = ({ 
  id, 
  title, 
  description, 
  instructor,
  mentorName,
  duration, 
  level, 
  category,
  price, 
  rating,
  averageRating,
  students,
  currentEnrollments = 0,
  maxStudents = 0,
  imageUrl,
  tags = [],
  status = "published",
  prerequisites = [],
  estimatedWeeks,
  difficulty,
  totalRatings = 0,
  isEnrolled = false,
  enrollmentProgress = 0,
  onEnroll,
  onViewDetails,
  onContinue,
  onManage
}: CourseCardProps) => {
  const currentUser = getCurrentUser();
  const isMentor = hasRole("mentor");
  const isAdmin = hasRole("admin");
  
  const displayRating = rating || averageRating || 0;
  const displayStudents = students || currentEnrollments || 0;
  const instructorName = instructor || mentorName || "Unknown Instructor";

  const getStatusColor = (courseStatus: string) => {
    switch (courseStatus) {
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "published": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getLevelColor = (courseLevel: string) => {
    switch (courseLevel?.toLowerCase()) {
      case "beginner": return "secondary";
      case "intermediate": return "default";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  const getDifficultyText = (diff?: number) => {
    if (!diff) return "";
    if (diff <= 3) return "Easy";
    if (diff <= 6) return "Medium";
    return "Hard";
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 group">
      {imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors flex-1">
            {title}
          </CardTitle>
          <div className="flex flex-col gap-1">
            <Badge variant={getLevelColor(level)}>
              {level}
            </Badge>
            {status !== "published" && (
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="capitalize">{category}</span>
          {difficulty && (
            <>
              <span>•</span>
              <span>{getDifficultyText(difficulty)}</span>
            </>
          )}
        </div>

        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </CardDescription>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {prerequisites.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Prerequisites:</span> {prerequisites.slice(0, 2).join(", ")}
            {prerequisites.length > 2 && " ..."}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Instructor:</span> {instructorName}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{Math.floor(duration / 60)}h {duration % 60}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-green-500" />
            <span>
              {displayStudents}
              {maxStudents > 0 && `/${maxStudents}`}
            </span>
          </div>
          {estimatedWeeks && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Duration: {estimatedWeeks} weeks</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{displayRating.toFixed(1)}</span>
            {totalRatings > 0 && (
              <span className="text-xs text-muted-foreground">({totalRatings})</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <DollarSign className="h-5 w-5" />
            <span>{Number(price).toFixed(2)}</span>
          </div>
        </div>

        {/* Enrollment Progress */}
        {isEnrolled && enrollmentProgress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(enrollmentProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${enrollmentProgress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        {isEnrolled ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(id)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onContinue?.(id)}
              className="flex-1"
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(id)}
              className="flex-1"
            >
              View Details
            </Button>
            {status === "published" && onEnroll && (
              <Button
                size="sm"
                onClick={() => onEnroll(id)}
                className="flex-1"
              >
                Enroll Now
              </Button>
            )}
          </>
        )}

        {/* Management Actions for Mentors/Admins */}
        {(isMentor || isAdmin) && onManage && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onManage(id)}
            className="min-w-fit"
          >
            Manage
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};