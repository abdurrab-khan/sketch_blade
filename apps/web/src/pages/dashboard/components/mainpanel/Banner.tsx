import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";

import { IconType } from "react-icons";
import { PlusIcon } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";
import { BsFillDiagram3Fill } from "react-icons/bs";
import { LuFileClock, LuFileHeart } from "react-icons/lu";
import { FaRegFolderOpen, FaUserGroup } from "react-icons/fa6";

import CreateFile from "@/components/dialogs/Createfile";
import Folderform from "@/components/dialogs/Folderform.tsx";

const Button = ({ title }: { title: string }) => (
  <div className="overflow-hidden rounded-xl shadow-xl shadow-slate-400/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-400/50 dark:hover:shadow-xl dark:hover:shadow-slate-400/20">
    <div className="bg-linear-to-r from-blue-400 to-blue-600 px-8 py-3 text-white/90 transition-opacity hover:opacity-90">
      <div className="text-nowrap">
        <PlusIcon className="inline h-6! w-6!" />
        <span className="ml-3 text-base font-semibold">{title}</span>
      </div>
    </div>
  </div>
);

const FileDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CreateFile isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button title="New Diagram" />
    </CreateFile>
  );
};

const FolderDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Folderform isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button title="New Folder" />
    </Folderform>
  );
};

const BannerContent: Record<
  string,
  { title: string; icon: IconType; description: string; button: React.ReactNode | null }
> = {
  "/dashboard": {
    title: "My Diagrams",
    icon: BsFillDiagram3Fill,
    description: "Manage and collaborate on your diagram projects",
    button: <FileDialog />,
  },
  "/dashboard/folders": {
    title: "My Folders",
    icon: FaRegFolderOpen,
    description: "Organize your diagrams and files into folders for better management.",
    button: <FolderDialog />,
  },
  "/dashboard/shared-with-me": {
    title: "Shared with Me",
    icon: FaUserGroup,
    description: "Collaborate on diagrams and files that have been shared with you by others.",
    button: null,
  },
  "/dashboard/favorite": {
    title: "Favorite",
    icon: LuFileHeart,
    description: "Quickly access your favorite diagrams and files for faster workflows.",
    button: null,
  },
  "/dashboard/recent": {
    title: "Recent",
    icon: LuFileClock,
    description: "Continue working on your most recently opened or edited diagrams.",
    button: null,
  },
  "/dashboard/trash": {
    title: "Trash",
    icon: IoTrashOutline,
    description:
      "Review and restore or permanently delete diagrams and files you've moved to trash.",
    button: null,
  },
};
const BannerKeys = Object.keys(BannerContent);

function Banner() {
  const location = useLocation();

  const key = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, "") || "/dashboard";
    return BannerKeys.find((k) => pathname.startsWith(k) && (k !== "/dashboard" || k === pathname));
  }, [location.pathname]);
  const { title, icon: Icon, description, button: TButton } = BannerContent[key!];

  return (
    <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div>
        <span className="text-primary-text-light flex items-center gap-x-3 text-4xl dark:text-white">
          <span className="text-3xl">
            <Icon />
          </span>
          <h3 className="font-bold">{title}</h3>
        </span>
        <span className="text-secondary-text-light/75 mt-1 block text-lg md:mt-2.5 dark:text-slate-400">
          <p className="font-medium">{description}</p>
        </span>
      </div>
      <div className="w-full text-end md:w-fit">{TButton}</div>
    </div>
  );
}

export default Banner;
