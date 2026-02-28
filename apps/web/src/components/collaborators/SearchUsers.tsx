import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";
import useApiClient from "@/hooks/useApiClient";
import React, { useCallback, useMemo, TransitionStartFunction } from "react";

import { debounce } from "lodash";

import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

import { ApiResponse } from "@/types";
import { Collaborator, SearchUser } from "@/types/collaborator";

interface ISearchUsersProps {
  email: string;
  searchedUsers: SearchUser[];
  existingCollaborators: Collaborator[];
  startTransition: TransitionStartFunction;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setSearchedUsers: React.Dispatch<React.SetStateAction<SearchUser[]>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
}

function SearchUsers({
  email,
  searchedUsers,
  existingCollaborators,
  setEmail,
  startTransition,
  setSearchedUsers,
  setSelectedCollaborator,
}: ISearchUsersProps) {
  const { toast } = useToast();
  const apiClient = useApiClient();

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
                  // Filter out existing collaborators
                  const filteredUsers = response.data.data.filter(
                    (user) => !existingCollaborators.some((collab) => collab.email === user.email),
                  );
                  setSearchedUsers(filteredUsers);
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
    [apiClient, existingCollaborators, setSearchedUsers, startTransition, toast],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;

      setEmail(email.trim());

      if (email.trim() === "") {
        debouncedSearch.cancel();

        if (searchedUsers.length > 0) {
          setSearchedUsers([]);
        }
        return;
      }

      debouncedSearch(email);
    },
    [debouncedSearch, searchedUsers.length, setEmail, setSearchedUsers],
  );

  return (
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
  );
}

export default SearchUsers;
