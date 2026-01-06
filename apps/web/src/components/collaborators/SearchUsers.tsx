import { cn } from "@/lib/utils";
import { Collaborator, CollaboratorActions, SearchUser } from "@/types/collaborator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { LucideLoaderCircle, SearchIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useMemo, useTransition } from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types";
import { debounce } from "tldraw";
import useApiClient from "@/hooks/useApiClient";
import useMutate from "@/hooks/useMutate";

interface ISearchResultToolTipsProps {
  user: SearchUser;
  fileId: string;
  role: CollaboratorActions;
  existingCollaborators: Collaborator[];
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}
interface ISearchUsersProps {
  fileId: string;
  role: CollaboratorActions;
  existingCollaborators: Collaborator[];
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
}

const SearchResultToolTips: React.FC<ISearchResultToolTipsProps> = ({
  user,
  role,
  fileId,
  existingCollaborators,
  setExistingCollaborators,
}) => {
  // mutation to add new collaborator
  const { mutate, isPending } = useMutate<Collaborator, Collaborator[]>({
    isShowToast: true,
    customOnSuccess: (coll) => {
      if (coll?.success) {
        setExistingCollaborators((prev) => [...prev, { ...user, role }]);
      }
    },
  });

  const handleAddCollaborators = () => {
    const hasUserAlreadyExists = existingCollaborators.some((coll) => coll.email === user.email);

    if (!hasUserAlreadyExists) {
      mutate({
        uri: `/collaborator/${fileId}`,
        method: "post",
        data: [
          {
            ...user,
            role: role,
          },
        ],
      });
    }
  };

  return (
    <TooltipProvider key={user._id}>
      <Tooltip>
        <TooltipTrigger onClick={handleAddCollaborators}>
          <div className="relative flex w-full items-center rounded-md bg-zinc-300 px-1.5 py-2 transition-colors hover:bg-zinc-400/50 dark:bg-blue-500/10 dark:text-white dark:hover:bg-blue-500/20">
            <img src={user.profileUrl} alt={user.fullName} className="h-8 w-8 rounded-full" />
            <p className="ml-4 dark:text-slate-200">{user.email}</p>
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

function SearchUsers({
  role,
  fileId,
  existingCollaborators,
  setExistingCollaborators,
  setSelectedCollaborator,
}: ISearchUsersProps) {
  const [email, setEmail] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<SearchUser[]>([]);

  const { toast } = useToast();
  const apiClient = useApiClient();
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (email: string) => {
        startTransition(async () => {
          try {
            const response = await apiClient.get<ApiResponse<SearchUser[]>>(
              `/users?email=${email}`,
            );

            startTransition(() => {
              if (response.status === 200) {
                if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
                  setSearchedUsers(response.data.data);
                }
              }
            });
          } catch (e) {
            const errMsg =
              (e as ApiResponse)?.message || "An error occurred during fetching collaborators.";

            toast({
              title: "Error",
              description: errMsg,
              variant: "destructive",
            });
          }
        });
      }, 400),
    [apiClient, toast],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;

      setEmail(email);

      if (email.trim() === "") {
        debouncedSearch.cancel();

        if (searchedUsers.length > 0) {
          setSearchedUsers([]);
        }
        return;
      }

      debouncedSearch(email);
    },
    [debouncedSearch, searchedUsers.length],
  );

  return (
    <React.Fragment>
      {/* Input for searching users by email */}
      <div className={"flex items-center"}>
        <SearchIcon className="ml-2 h-4! w-4! dark:text-white" />
        <Input
          className={cn(
            "border-0 shadow-none ring-0 outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          )}
          placeholder={"Search for collaborators by email"}
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={handleInputChange}
          onFocus={() => setSelectedCollaborator(null)}
        />
      </div>

      {/* Showing the founded users */}
      <AnimatePresence>
        {email.length > 0 && (
          <motion.div
            initial={{ opacity: 0, translateY: "18px", scale: 0.8 }}
            animate={{ opacity: 1, translateY: "0px", scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="dark:bg-primary-bg-dark absolute top-[calc(100%+12px)] max-h-40 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/80 dark:border-blue-500/20 dark:shadow-black/30"
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
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export default SearchUsers;
