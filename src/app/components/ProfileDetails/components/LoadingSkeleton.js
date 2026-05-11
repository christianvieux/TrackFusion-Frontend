import { Card, Skeleton } from "@heroui/react";

export default function LoadingSkeleton() {
  return (
    <Card className="w-full bg-secondary p-6 text-foreground shadow-card">
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <Skeleton className="size-32 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>

        <div className="flex gap-8">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-col gap-1">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}