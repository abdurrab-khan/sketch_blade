import useMutate from "@/hooks/useMutate";
import { motion, AnimatePresence } from "motion/react";

import { LucideLoaderCircle } from "lucide-react";

import { Collaborator, CollaboratorActions, SearchUser } from "@/types/collaborator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface ISearchResultToolTipsProps {
  user: SearchUser;
  fileId: string;
  role: CollaboratorActions;
  existingCollaborators: Collaborator[];
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setSearchedUsers: React.Dispatch<React.SetStateAction<SearchUser[]>>;
}

interface IShowSearchUser {
  fileId: string;
  isPending: boolean;
  role: CollaboratorActions;
  searchedUsers: SearchUser[];
  existingCollaborators: Collaborator[];
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setSearchedUsers: React.Dispatch<React.SetStateAction<SearchUser[]>>;
}

const SearchResultToolTips: React.FC<ISearchResultToolTipsProps> = ({
  user,
  role,
  fileId,
  existingCollaborators,
  setSearchedUsers,
  setExistingCollaborators,
}) => {
  // mutation to add new collaborator
  const { mutate, isPending } = useMutate<
    Collaborator,
    { email: string; role: CollaboratorActions }
  >({
    isShowToast: true,
    customOnSuccess: (coll) => {
      if (coll) {
        setExistingCollaborators((prev) => [...prev, coll]);
        setSearchedUsers((prev) => prev.filter((u) => u.email !== coll.email));
      }
    },
  });

  const handleAddCollaborators = () => {
    const hasUserAlreadyExists = existingCollaborators.some((coll) => coll.email === user.email);

    if (!hasUserAlreadyExists) {
      mutate({
        uri: `/collaborator/${fileId}`,
        method: "post",
        data: {
          email: user.email,
          role: role,
        },
      });
    }
  };

  return (
    <TooltipProvider key={user._id}>
      <Tooltip>
        <TooltipTrigger onClick={handleAddCollaborators}>
          <div
            className={cn(
              "relative flex w-full items-center overflow-hidden rounded-lg border border-zinc-500/30 bg-zinc-300 px-2.5 py-2 transition-colors hover:bg-zinc-400/50 dark:border-zinc-400/15 dark:bg-blue-500/10 dark:text-white dark:hover:bg-blue-500/20",
              isPending && "chip-shimmer__animation opacity-50",
            )}
          >
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img src={user.profileUrl} alt={user.fullName} className="size-full" />
            </div>
            <div className="ml-2 w-full flex-1 overflow-hidden">
              <div className="flex flex-col items-start justify-center">
                <p className="font-medium dark:text-slate-200">{user.fullName}</p>
                <div className="wrap-break-words min-w-0 overflow-hidden">
                  <p className="text-xs dark:text-slate-200/80">{user.email}</p>
                </div>
              </div>
            </div>
            <TooltipContent>
              <p>
                Click to add {user.fullName} as a {role}
              </p>
            </TooltipContent>
          </div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

function ShowSearchedUser({
  fileId,
  role,
  isPending,
  searchedUsers,
  existingCollaborators,
  setSearchedUsers,
  setExistingCollaborators,
}: IShowSearchUser) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, translateY: "18px", scale: 0.8 }}
        animate={{ opacity: 1, translateY: "0px", scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="dark:bg-primary-bg-dark max-h-40 w-full overflow-y-auto rounded-b-md border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/80 dark:border-blue-500/20 dark:shadow-black/30"
      >
        <div className="size-full p-2">
          {isPending ? (
            <LucideLoaderCircle className="mx-auto h-6 w-6 animate-spin text-zinc-500 dark:text-blue-400" />
          ) : (
            <div className={"flex flex-col gap-y-2"}>
              {searchedUsers.length > 0 ? (
                searchedUsers.map((user) => (
                  <SearchResultToolTips
                    key={user._id}
                    user={user}
                    role={role}
                    fileId={fileId}
                    existingCollaborators={existingCollaborators}
                    setSearchedUsers={setSearchedUsers}
                    setExistingCollaborators={setExistingCollaborators}
                  />
                ))
              ) : (
                <p className="py-3 text-center text-sm text-zinc-500 dark:text-slate-400">
                  No collaborators found.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ShowSearchedUser;
