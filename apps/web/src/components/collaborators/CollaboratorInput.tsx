import React, { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { CollaboratorActions, Collaborator } from "@/types/collaborator.ts";

import { cn } from "@/lib/utils.ts";
import { XIcon } from "lucide-react";

interface ICollaboratorInputProps {
  fileId: string;
  role: CollaboratorActions;
  exisitingCollaborators: Collaborator[];
}

const CollaboratorInput: React.FC<ICollaboratorInputProps> = ({ fileId }) => {
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  return (
    <React.Fragment>
      <motion.div
        className={cn(
          "transform-center bg-secondary dark:bg-primary-bg-dark min-h-10 overflow-hidden rounded-md border border-zinc-300",
          "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none",
          formCollaborators.length > 0 && "pt-2",
        )}
        initial={{ paddingTop: 0 }}
        animate={{ paddingTop: formCollaborators.length > 0 ? 8 : 0 }}
      >
        <AnimatePresence mode={"wait"}>
          {formCollaborators.length > 0 && (
            <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto p-1">
              {formCollaborators.map((collaborator) => (
                <motion.div
                  key={collaborator._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  transition={{
                    type: "tween",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.15,
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-x-2.5 rounded-full border border-zinc-200 bg-zinc-400 px-3 py-2 text-white select-none focus:border-2 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-white",
                    selectedCollaborator?._id === collaborator._id &&
                      selectedCollaborator?._id === collaborator._id &&
                      "dark:ring-offset-primary-bg-dark ring-2 ring-slate-800 ring-offset-2 dark:ring-blue-400",
                  )}
                  onClick={() => {
                    setSelectedCollaborator(collaborator);
                    setRole(collaborator.role);
                  }}
                >
                  <img
                    src={collaborator.profileUrl}
                    alt={collaborator.fullName}
                    className="h-6 w-6 rounded-full"
                  />
                  <p>{collaborator.fullName}</p>
                  <button
                    type="button"
                    data-email={collaborator.email}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCollaborators(collaborator);
                    }}
                    className="cursor-pointer"
                  >
                    <XIcon className="h-5 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </React.Fragment>
  );
};

export default CollaboratorInput;
