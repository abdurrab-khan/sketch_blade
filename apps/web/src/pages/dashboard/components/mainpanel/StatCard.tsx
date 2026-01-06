import clsx from "clsx";
import { IconType } from "react-icons";
import { MdGroups } from "react-icons/md";
import { FaFile, FaFolder, FaShareNodes } from "react-icons/fa6";
import useResponse from "@/hooks/useResponse";
import { Stat } from "@/types";

function StatManager() {
  const { data, isLoading } = useResponse<Stat>({
    queryKey: ["getStats"],
    queryProps: {
      uri: "/stat",
    },
  });

  const stat = data?.data;

  // return null if no data
  if (!stat) return null;

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
