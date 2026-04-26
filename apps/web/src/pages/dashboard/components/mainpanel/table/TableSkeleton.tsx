import { Skeleton } from "@/components/ui/skeleton";

interface FolderTableSkeletonProps {
  showActions?: boolean;
  actionsCount?: number;
  rows?: number;
}

const TableSkeleton = ({
  actionsCount = 2,
  showActions = true,
  rows = 7,
}: FolderTableSkeletonProps) => {
  const skeletonTone = "bg-slate-200/70 dark:bg-blue-500/15";

  return (
    <div className="flex size-full flex-1 flex-col">
      {showActions && (
        <div className="mb-2.5 h-fit">
          <div className="flex flex-wrap gap-x-2 gap-y-4">
            {Array.from({ length: actionsCount }).map((_, index) => (
              <Skeleton key={index} className={`h-10 w-36 rounded-xl ${skeletonTone}`} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-primary-bg-light dark:bg-secondary-bg-dark border-border-light dark:border-border-dark overflow-hidden rounded-xl border shadow-2xl shadow-slate-500/20 dark:ring-1 dark:shadow-black/20 dark:ring-blue-500/10">
        <div className="bg-secondary-bg-light dark:bg-tertiary-bg-dark border-border-light dark:border-border-dark border-b px-4 py-3">
          <div className="grid grid-cols-[2fr_1.3fr_1.2fr_0.8fr] gap-4">
            <Skeleton className={`h-4 w-28 ${skeletonTone}`} />
            <Skeleton className={`h-4 w-24 ${skeletonTone}`} />
            <Skeleton className={`h-4 w-20 ${skeletonTone}`} />
            <Skeleton className={`h-4 w-14 justify-self-end ${skeletonTone}`} />
          </div>
        </div>

        <div className="divide-border-light dark:divide-border-dark divide-y">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={`folder-row-skeleton-${index}`}
              className="grid grid-cols-[2fr_1.3fr_1.2fr_0.8fr] items-center gap-4 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className={`size-8 rounded-lg ${skeletonTone}`} />
                <Skeleton className={`h-4 w-40 ${skeletonTone}`} />
              </div>
              <Skeleton className={`h-4 w-28 ${skeletonTone}`} />
              <Skeleton className={`h-4 w-24 ${skeletonTone}`} />
              <Skeleton className={`h-8 w-8 justify-self-end rounded-md ${skeletonTone}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
