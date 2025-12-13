import React from "react";
import { Loader2 } from "lucide-react";
import { SlashIcon } from "lucide-react";
import { FolderDetails } from "@/types/file";
import { useParams, Link } from "react-router";
import useResponse from "@/hooks/useResponse";
import FilesTable from "@/components/ui/table/FilesTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function FolderFiles() {
  const { folderId } = useParams();

  const { data, isPending, isFetching } = useResponse<FolderDetails[]>({
    queryProps: { uri: `/folder/file/${folderId}` },
    queryKey: ["getFiles"],
  });

  if (isPending || isFetching) {
    return (
      <div className={"flex-center size-full flex-1"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-1 flex-col gap-y-3">
      <div className="h-fit border-b border-slate-500/30 px-3.5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-base font-medium">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/folders" className="text-base font-medium">
                  Folders
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-medium">{data?.data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex size-full flex-1 flex-col">
        <FilesTable data={data?.data?.files ?? []} />
      </div>
    </div>
  );
}

export default FolderFiles;
