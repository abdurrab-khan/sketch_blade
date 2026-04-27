import { Suspense } from "react";
import clsx from "clsx";
import { IconType } from "react-icons";
import { MdGroups } from "react-icons/md";
import { FaFile, FaFolder, FaShareNodes } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import useSuspenseResponse from "@/hooks/use-suspense-response";
import { Stat } from "@/types";

function StatManagerContent() {
  const data = useSuspenseResponse<Stat>({
    queryKey: ["getStats"],
    queryProps: {
      uri: "/stat",
    },
  });

  // return null if no data
  if (!data?.data) return null;

  const stat = data.data;

  return (
    <div className="flex shrink flex-wrap gap-x-0 gap-y-3 sm:gap-x-4 sm:gap-y-4 xl:gap-x-12">
      <StatCard icon={FaFile} count={stat.totalDiagrams} title="Total Diagrams" />
      <StatCard icon={MdGroups} count={stat.totalCollaborators} title="Collaborators" />
      <StatCard icon={FaFolder} count={stat.totalFolders} title="Folders" />
      <StatCard
        icon={FaShareNodes}
        count={stat.totalSharedDiagrams}
        title="Shared Diagrams"
        style="from-red-400 to-red-500"
      />
    </div>
  );
}

function StatSkeletonCard({ accent = "" }: { accent?: string }) {
  return (
    <div className="bg-primary-bg-light dark:bg-secondary-bg-dark h-50 w-full rounded-2xl border border-slate-300/25 px-8 py-6 shadow-lg shadow-slate-400/25 md:w-[calc(50%-0.5rem)] lg:w-64 2xl:w-[20rem] dark:border-blue-500/10 dark:shadow-blue-500/5">
      <div className="flex size-full flex-col justify-center">
        <div className="relative h-12 w-12">
          <Skeleton
            className={clsx(
              accent,
              "h-12 w-12 rounded-xl bg-linear-to-br from-blue-400/70 to-blue-600/70",
            )}
          />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-10 w-20 rounded-lg bg-slate-200/80 dark:bg-slate-700/60" />
          <Skeleton className="h-4 w-28 rounded-md bg-slate-300/70 dark:bg-slate-600/60" />
        </div>
      </div>
    </div>
  );
}

function StatSkeletonFallback() {
  return (
    <div className="flex shrink flex-wrap gap-x-0 gap-y-3 sm:gap-x-4 sm:gap-y-4 xl:gap-x-12">
      <StatSkeletonCard />
      <StatSkeletonCard />
      <StatSkeletonCard />
      <StatSkeletonCard accent="from-red-400/70 to-red-500/70" />
    </div>
  );
}

function StatManager() {
  return (
    <Suspense fallback={<StatSkeletonFallback />}>
      <StatManagerContent />
    </Suspense>
  );
}

interface StatCardProps {
  icon: IconType;
  count: number;
  title: string;
  style?: string;
}

function StatCard({ icon: Icon, count, title, style = "" }: StatCardProps) {
  const numParser = () => {
    return `${count < 10 && count > 0 ? 0 : ""}${count}`;
  };

  return (
    <div className="bg-primary-bg-light dark:bg-secondary-bg-dark h-50 w-full rounded-2xl border border-slate-300/25 px-8 py-6 shadow-lg shadow-slate-400/40 transition-all duration-300 select-none hover:-translate-y-0.5 hover:shadow-slate-400/50 md:w-[calc(50%-0.5rem)] lg:w-64 2xl:w-[20rem] dark:border-blue-500/10 dark:shadow-blue-500/5 dark:hover:border-blue-500/20 dark:hover:shadow-blue-500/10">
      <div className="flex size-full flex-col justify-center">
        <div
          className={clsx(
            style,
            "flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30",
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="mt-2">
          <p className="text-primary-text-light text-4xl font-bold dark:text-white">
            {numParser()}
          </p>
          <p className="text-md text-secondary-text-light/70 font-medium dark:text-slate-400">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatManager;
