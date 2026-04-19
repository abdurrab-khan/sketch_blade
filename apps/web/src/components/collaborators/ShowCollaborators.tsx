import React from "react";

import { AnimatePresence, motion } from "motion/react";

import { CollaboratorActions, Collaborator } from "@/types/collaborator.ts";

import { cn } from "@/lib/utils.ts";
import { XIcon } from "lucide-react";
import useMutate from "@/hooks/useMutate";

interface ICollaboratorsChipsProps {
  fileId: string;
  collaborator: Collaborator;
  selectedCollaborator: Collaborator | null;
  setRole: React.Dispatch<React.SetStateAction<CollaboratorActions>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

interface IShowCollaboratorsProps {
  fileId: string;
  existingCollaborators: Collaborator[];
  selectedCollaborator: Collaborator | null;
  setRole: React.Dispatch<React.SetStateAction<CollaboratorActions>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

const CollaboratorsChips: React.FC<ICollaboratorsChipsProps> = ({
  fileId,
  collaborator,
  selectedCollaborator,
  setRole,
  setSelectedCollaborator,
  setExistingCollaborators,
}) => {
  // mutate for deleting the collaborator
  const { mutate, isPending } = useMutate<undefined, { collaboratorId: string }>({
    isShowToast: true,
    options: {
      queryKey: ["getStats"],
    },
    customOnSuccess: () => {
      setSelectedCollaborator(null);
      setExistingCollaborators((prev) => prev.filter((coll) => coll._id !== collaborator._id));
    },
  });

  // Handle when user select any collaborator --> add into selectedCollaborator and role
  const handleSelectCollaborator = () => {
    setRole(collaborator.role);
    setSelectedCollaborator(collaborator);
  };

  const handleRemoveCollaborator = async () => {
    mutate({
      uri: `/collaborator/${fileId}`,
      method: "put",
      data: {
        collaboratorId: collaborator._id,
      },
    });
  };

  return (
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
        "relative flex cursor-pointer items-center justify-center gap-x-2.5 overflow-hidden rounded-full border border-zinc-200 bg-zinc-400 px-3 py-2 text-white select-none focus:border-2 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-white",
        selectedCollaborator?._id === collaborator._id &&
          "dark:ring-offset-primary-bg-dark ring-2 ring-slate-800 ring-offset-2 dark:ring-blue-400",
        isPending && "chip-shimmer__animation",
      )}
      onClick={handleSelectCollaborator}
    >
      <img
        src={collaborator.profileUrl}
        alt={collaborator.fullName}
        className="h-6 w-6 rounded-full"
      />
      <p>{collaborator.fullName}</p>
      {!isPending && (
        <button type="button" onClick={handleRemoveCollaborator} className="cursor-pointer">
          <XIcon className="h-5 w-4" />
        </button>
      )}
    </motion.div>
  );
};

function ShowCollaborators({
  fileId,
  selectedCollaborator,
  existingCollaborators,
  setRole,
  setSelectedCollaborator,
  setExistingCollaborators,
}: IShowCollaboratorsProps) {
  return (
    <motion.div
      className={cn("transform-center overflow-hidden", existingCollaborators.length > 0 && "pt-2")}
      initial={{ paddingTop: 0 }}
      animate={{ paddingTop: existingCollaborators.length > 0 ? 8 : 0 }}
    >
      <AnimatePresence mode={"wait"}>
        {existingCollaborators.length > 0 && (
          <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto p-1">
            {existingCollaborators.map((coll) => (
              <CollaboratorsChips
                key={coll._id}
                fileId={fileId}
                collaborator={coll}
                selectedCollaborator={selectedCollaborator}
                setRole={setRole}
                setSelectedCollaborator={setSelectedCollaborator}
                setExistingCollaborators={setExistingCollaborators}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ShowCollaborators;
