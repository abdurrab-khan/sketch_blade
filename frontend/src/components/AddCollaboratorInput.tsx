import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";


import * as z from "zod";
import { debounce } from "lodash";
import { cn } from "../lib/utils.ts";
import { ApiResponse } from "@/types/index.ts";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { UseFormSetValue } from "react-hook-form";
import useApiClient from "@/hooks/useApiClient.ts";
import {
  CollaboratorActions,
  CollaboratorData,
  ListCollaborator,
} from "../types/user.ts";
import { useToast } from "@/hooks/use-toast.ts";

interface AddCollaboratorInputProps {
  collaborators: CollaboratorData[];
  setCollaborators: UseFormSetValue<z.infer<typeof fileSchema>>;
}

const AddCollaboratorInput: React.FC<AddCollaboratorInputProps> = ({
  collaborators,
  setCollaborators,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [listColl, setListColl] = useState<ListCollaborator[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CollaboratorActions>("view" as CollaboratorActions);
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorData | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const apiClient = useApiClient();
  const { toast } = useToast();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (email: string) => {
        startTransition(async () => {
          try {
            const response = await apiClient.get<ApiResponse<ListCollaborator>>(`/users?email=${email}`);

            startTransition(() => {
              if (response.status === 200) {
                if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
                  setListColl(response.data.data);
                }
              }
            });
          } catch (e) {
            const errMsg = (e as ApiResponse)?.message || "An error occurred during fetching collaborators."

            toast({
              title: "Error",
              description: errMsg,
              variant: "destructive"
            });
          } finally {
            setIsPending(false);
          }
        });
      }, 400),
    [apiClient, toast],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;

      setEmail(email);
      setIsPending(true);

      // If there is no input text in input field.
      if (email.trim() === "") {
        // Cancel any pending debounced calls
        debouncedSearch.cancel();

        // Clear if there is collaborators, if input field having nothing.
        if (listColl.length > 0) {
          setListColl([]);
        }
        return;
      }

      debouncedSearch(email);
    },
    [debouncedSearch, listColl.length],
  );

  const handleAddCollaborators = (collaboratorData: CollaboratorData) => {
    const isAlreadySelected = collaborators.some((coll) => coll._id === collaboratorData._id);

    if (isAlreadySelected) return;

    setCollaborators("collaborators", collaborators.concat(collaboratorData)); // Concat previous and new collaborators

    setListColl([]);
    setInputSearch("");
  };

  const handleChangeRole = (_id: string, role: CollaboratorActions) => {
    // Changing the roll from collaborators
    const updatedCollaborators = collaborators.map((coll) => (coll._id === _id ? { ...coll, actions: role } : coll));

    setCollaborators("collaborators", updatedCollaborators);
  };

  const handleRemoveCollaborators = (e: React.MouseEvent<HTMLButtonElement>, collId: string) => {
    e.stopPropagation();

    // Removing collaborator
    const removedCollaborators = collaborators.filter((coll) => coll._id !== collId);
    setCollaborators("collaborators", removedCollaborators)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setListColl([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="collaborator-search">Add Collaborators</Label>
      <div className={"relative flex items-start justify-between gap-x-2"}>
        <div className="flex-1">
          <motion.div
            className={cn(
              "border-input transform-center min-h-10 rounded-md border bg-secondary pl-2",
              "focus-within:ring-ring focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
              collaborators.length > 0 && "pt-2",
            )}
            initial={{ paddingTop: 0 }}
            animate={{ paddingTop: collaborators.length > 0 ? 8 : 0 }}
          >
            <AnimatePresence mode={"wait"}>
              {collaborators.length > 0 && (
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto p-1">
                  {collaborators.map((collaborator) => (
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
                        "flex items-center justify-center gap-x-2.5 rounded-full border border-zinc-200 bg-primary px-2 py-1 text-white focus:border-2",
                        selectedCollaborator?._id === collaborator._id &&
                        selectedCollaborator?._id === collaborator._id &&
                        "ring-1 ring-offset-1",
                      )}
                      onClick={() => {
                        setSelectedCollaborator(collaborator);
                        setRole(collaborator.actions);
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
                        onClick={(e) => handleRemoveCollaborators(e, collaborator._id)}
                      >
                        <XIcon className="h-5 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            <div className={"flex items-center gap-x-1.5"}>
              <SearchIcon className="h-5 w-5" />
              <Input
                className={cn(
                  "border-0 shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  "dark-input bg-gray-100 dark:bg-gray-800",
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
          </motion.div>
        </div>
        <div className={"w-fit"}>
          <Select
            defaultValue={"view"}
            value={role}
            disabled={isPending}
            onValueChange={(value) => {
              if (selectedCollaborator) {
                handleChangeRole(selectedCollaborator._id, value as CollaboratorActions);
              }
              setRole(value as CollaboratorActions);
            }}
          >
            <SelectTrigger className="dark-container">
              <SelectValue placeholder="Choose it" />
            </SelectTrigger>
            <SelectContent className={"dark-container"}>
              <SelectGroup>
                <SelectLabel>Choose option</SelectLabel>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="view">View</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Showing all Collaborators */}
        <AnimatePresence>
          {
            email.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute top-[120%] max-h-40 w-full overflow-y-auto rounded-md border border-zinc-200 bg-tertiary p-2"
              >
                {
                  isPending ? (
                    <div>Loading.....</div>
                  ) : (
                    <div className={"flex flex-col gap-y-2"} ref={dropdownRef}>
                      {listColl.length > 0 ? listColl.map((collaborator) =>
                      (
                        <TooltipProvider key={collaborator._id}>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddCollaborators({
                                  ...collaborator,
                                  actions: role,
                                });
                              }}
                            >
                              <div className="relative flex w-full items-center rounded-md bg-secondary px-1.5 py-2">
                                <img
                                  src={collaborator.profileUrl}
                                  alt={collaborator.fullName}
                                  className="h-8 w-8 rounded-full"
                                />
                                <p className="ml-4">{collaborator.email}</p>
                                <TooltipContent>
                                  <p>Click to add {collaborator.fullName} as a collaborator</p>
                                </TooltipContent>
                              </div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      )) : (
                        <div>
                          No Collaborators found with this email {email}
                        </div>
                      )}
                    </div>
                  )
                }
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>
    </div >
  );
};

export default AddCollaboratorInput;
