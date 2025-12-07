import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "react-router";
import Fileform from "@/components/dialogs/Fileform.tsx";
import Folderform from "@/components/dialogs/Folderform.tsx";

const Button = ({ title }: { title: string }) => (
  <div className="overflow-hidden rounded-xl shadow-xl shadow-slate-400/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-400">
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
    <Fileform isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button title="New Diagram" />
    </Fileform>
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
  { title: string; description: string; button: React.ReactNode | null }
> = {
  "/": {
    title: "My Diagrams",
    description: "Manage and collaborate on your diagram projects",
    button: <FileDialog />,
  },
  "/folders": {
    title: "My Folders",
    description: "Organize your diagrams and files into folders for better management.",
    button: <FolderDialog />,
  },
  "/shared-with-me": {
    title: "Shared with Me",
    description: "Collaborate on diagrams and files that have been shared with you by others.",
    button: null,
  },
  "/favorite": {
    title: "Favorite",
    description: "Quickly access your favorite diagrams and files for faster workflows.",
    button: null,
  },
  "/recent": {
    title: "Recent",
    description: "Continue working on your most recently opened or edited diagrams.",
    button: null,
  },
  "/trash": {
    title: "Trash",
    description:
      "Review and restore or permanently delete diagrams and files you've moved to trash.",
    button: null,
  },
};

function Banner() {
  const location = useLocation();

  const pathname = location.pathname.startsWith("/folders/") ? "/folders" : location.pathname;
  const { title, description, button: TButton } = BannerContent[pathname]!;

  return (
    <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div>
        <span className="text-primary-text-light block text-4xl">
          <h3 className="font-bold">{title}</h3>
        </span>
        <span className="text-secondary-text-light/75 mt-1 block text-lg md:mt-2.5">
          <p className="font-medium">{description}</p>
        </span>
      </div>
      <div className="w-full text-end md:w-fit">{TButton}</div>
    </div>
  );
}

export default Banner;
