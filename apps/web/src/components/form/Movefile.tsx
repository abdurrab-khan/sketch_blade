import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { FaFolderOpen } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import useResponse from "@/hooks/useResponse";
import { FolderDetails } from "@/types/file";

interface FolderCardProps {
  id: string;
  name: string;
  setSelectFolderId: React.Dispatch<React.SetStateAction<string>>;
}

interface IMovefileProps {
  selectedFolder: string;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string>>;
}

const FolderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-muted/30 flex w-full items-center justify-between rounded-lg px-4 py-3.5">
      <span className="flex items-center gap-x-3">
        <Skeleton className="h-10 w-10 rounded-lg bg-blue-100/50 dark:bg-blue-500/10" />
        <Skeleton className="bg-muted-foreground/20 h-4 w-32" />
      </span>
    </div>
  );
};

const FolderCard: React.FC<FolderCardProps> = ({ id, name }) => {
  return (
    <Label
      htmlFor={id}
      className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border-2 border-transparent bg-linear-to-r from-transparent to-transparent px-4 py-3.5 transition-all duration-300 ease-in-out hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-md has-data-[state=checked]:border-blue-500 has-data-[state=checked]:bg-blue-100 has-data-[state=checked]:shadow-lg has-data-[state=checked]:shadow-blue-500/20 dark:hover:bg-blue-500/5 dark:has-data-[state=checked]:bg-blue-500/10"
    >
      <span className="relative z-10 flex items-center gap-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-all duration-300 group-hover:bg-blue-200 group-has-data-[state=checked]:bg-blue-200 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20 dark:group-has-data-[state=checked]:bg-blue-500/30">
          <FaFolderOpen className="dark:text-muted-foreground h-5 w-5 text-blue-500 transition-all duration-300 group-hover:text-blue-600 group-has-data-[state=checked]:text-blue-600 dark:group-hover:text-blue-400 dark:group-has-data-[state=checked]:text-blue-500" />
        </div>
        <p className="text-foreground text-sm font-medium transition-all duration-300 group-has-data-[state=checked]:text-blue-600 dark:group-has-data-[state=checked]:text-blue-500">
          {name}
        </p>
      </span>

      <RadioGroupItem id={id} value={id} className="sr-only" />
      <div className="absolute inset-0 z-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 transition-opacity duration-300 group-has-data-[state=checked]:opacity-100" />
    </Label>
  );
};

function Movefile({ selectedFolder, setSelectedFolder }: IMovefileProps) {
  const { data: folders, isPending } = useResponse<FolderDetails[]>({
    queryKey: ["getFolder"],
    queryProps: {
      uri: "/folder",
    },
  });

  const handleValueChange = (value: string) => {
    setSelectedFolder(value);
  };

  return (
    <div className={"flex h-full flex-col flex-wrap gap-4"}>
      {isPending ? (
        <div className={"flex size-full flex-col"}>
          <FolderCardSkeleton />
          <FolderCardSkeleton />
          <FolderCardSkeleton />
        </div>
      ) : !folders?.data || folders.data.length === 0 ? (
        <div
          className={
            "text-primary-text-light dark:text-primary-text-dark flex flex-col items-center justify-center py-8 text-center"
          }
        >
          <div className="bg-muted/50 mb-3 rounded-full p-4">
            <FaFolderOpen className="text-muted-foreground h-8 w-8" />
          </div>
          <p className={"text-muted-foreground text-sm font-medium"}>No folders found</p>
          <p className={"text-muted-foreground/70 mt-1 text-xs"}>
            Create a folder to organize your files
          </p>
        </div>
      ) : (
        <RadioGroup value={selectedFolder} onValueChange={handleValueChange}>
          {folders?.data?.map(({ _id, name }) => (
            <FolderCard key={_id} id={_id} name={name} setSelectFolderId={setSelectedFolder} />
          ))}
        </RadioGroup>
      )}
    </div>
  );
}

export default Movefile;
