import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CourseCardSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-5 w-20" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
      <div className="mb-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

export const MentorCardSkeleton = () => (
  <Card className="h-full">
    <div className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-1 mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
      <Skeleton className="h-16 w-full mb-4" />
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-6 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  </Card>
);

export const LiveSessionSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
  </Card>
);

export const LoadingGrid = ({ 
  children, 
  count = 6, 
  className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
}: { 
  children: React.ReactNode; 
  count?: number; 
  className?: string;
}) => (
  <div className={className}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>{children}</div>
    ))}
  </div>
);