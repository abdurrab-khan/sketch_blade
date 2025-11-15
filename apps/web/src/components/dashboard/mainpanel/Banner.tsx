import FileForm from "@/components/dialogs/FileForm";
import FolderForm from "@/components/dialogs/FolderForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useLocation } from "react-router";

const MButton = ({ title }: { title: string }) => (
  <Button
    variant={"primary"}
    className="rounded-xl px-8 py-6 shadow-xl shadow-slate-400/10 hover:scale-105 hover:shadow-2xl hover:shadow-slate-400"
  >
    <PlusIcon className="h-6! w-6!" />
    <span className="text-base">{title}</span>
  </Button>
);

const BannerContent: Record<
  string,
  { title: string; description: string; button: React.ReactNode | null }
> = {
  "/": {
    title: "My Diagrams",
    description: "Manage and collaborate on your diagram projects",
    button: (
      <FileForm>
        <MButton title="New Diagram" />
      </FileForm>
    ),
  },
  "/my-files": {
    title: "My Files",
    description: "Manage and organize all your diagram files in a single place.",
    button: (
      <FolderForm>
        <MButton title="New Folder" />
      </FolderForm>
    ),
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
  const { pathname } = useLocation();
  const { title, description, button: TButton } = BannerContent[pathname]!;

  return (
    <React.Fragment>
      <div>
        <span className="text-primary-text-light block text-4xl">
          <h3 className="font-bold">{title}</h3>
        </span>
        <span className="text-secondary-text-light/75 mt-2.5 block text-lg">
          <p className="font-medium">{description}</p>
        </span>
      </div>
      {TButton}
    </React.Fragment>
  );
}

export default Banner;
