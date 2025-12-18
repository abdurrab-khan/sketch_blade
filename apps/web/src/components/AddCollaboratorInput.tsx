import * as z from "zod";
import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

import { debounce } from "lodash";
import { AnimatePresence, motion } from "motion/react";

import { ApiResponse } from "@/types/index.ts";
import { CollaboratorActions, Collaborator, ListCollaborator } from "@/types/collaborator.ts";

import { fileSchema } from "@/lib/zod/schemas.ts";
import { cn } from "@/lib/utils.ts";
import { useToast } from "@/hooks/use-toast.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { LucideLoaderCircle, SearchIcon, XIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { ICollaboratorState } from "./dialogs/Updatefile";

interface AddCollaboratorInputProps {
  watch: UseFormWatch<z.infer<typeof fileSchema>>;
  setValue: UseFormSetValue<z.infer<typeof fileSchema>>;
  collaboratorState?: ICollaboratorState;
  setCollaboratorState?: React.Dispatch<React.SetStateAction<ICollaboratorState>>;
}

const AddCollaboratorInput: React.FC<AddCollaboratorInputProps> = ({
  watch,
  setValue,
  collaboratorState,
  setCollaboratorState,
}) => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [listColl, setListColl] = useState<ListCollaborator[]>([]);
  const [role, setRole] = useState<CollaboratorActions>("view" as CollaboratorActions);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  const collaborators = watch("collaborators") || [];

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const apiClient = useApiClient();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (email: string) => {
        startTransition(async () => {
          try {
            const response = await apiClient.get<ApiResponse<ListCollaborator>>(
              `/users?email=${email}`,
            );

            startTransition(() => {
              if (response.status === 200) {
                if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
                  setListColl(response.data.data);
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

      if (email.trim() === "") {
        debouncedSearch.cancel();

        if (listColl.length > 0) {
          setListColl([]);
        }
        return;
      }

      debouncedSearch(email);
    },
    [debouncedSearch, listColl.length],
  );

  const handleChangeRole = (value: string) => {
    setRole(value as CollaboratorActions);

    if (selectedCollaborator) {
      const updatedCollaborators = collaborators?.map((coll) =>
        coll._id === selectedCollaborator._id
          ? { ...coll, role: value as CollaboratorActions }
          : coll,
      );

      setValue("collaborators", updatedCollaborators);
    }
  };

  const handleAddCollaborators = (collaborator: Collaborator) => {
    const isAlreadyAdded = collaborators.some((coll) => coll._id === collaborator._id);

    if (isAlreadyAdded) return;

    const { email } = collaborator;

    // changing collaborator state if there
    if (collaboratorState && setCollaboratorState) {
      const { removedCollaborators } = collaboratorState;

      const alreadyInRemove = removedCollaborators.find((c) => c.email === email);

      // Already in remove --> already collaborator exists
      if (alreadyInRemove) {
        setCollaboratorState((prev) => ({
          ...prev,
          removedCollaborators: prev.removedCollaborators.filter((c) => c.email !== email),
        }));

        // Add from removed state instead of collaborators
        setValue("collaborators", [
          {
            ...alreadyInRemove,
          },
        ]);

        setEmail("");
        setListColl([]);
        return;
      } else {
        // Not in removed --> have to add it.
        setCollaboratorState((prev) => ({
          ...prev,
          newCollaborators: [...prev.newCollaborators, collaborator],
        }));
      }
    }

    setValue("collaborators", [
      {
        ...collaborator,
      },
    ]);

    // RESET INPUT AND LIST
    setEmail("");
    setListColl([]);
  };

  const handleRemoveCollaborators = (collaborator: Collaborator) => {
    const { email } = collaborator;

    if (collaboratorState && setCollaboratorState) {
      const { newCollaborators } = collaboratorState;

      const isAlreadyInAddList = newCollaborators.find((c) => c.email === email);

      // If in add list no need to add for remove
      if (isAlreadyInAddList) {
        setCollaboratorState((prev) => ({
          ...prev,
          newCollaborators: prev.newCollaborators.filter((c) => c.email !== email),
        }));
      } else {
        setCollaboratorState((prev) => ({
          ...prev,
          removedCollaborators: [...prev.removedCollaborators, collaborator],
        }));
      }
    }

    const filteredCollaborators = collaborators?.filter((coll) => coll.email !== email);

    setValue("collaborators", filteredCollaborators);
  };

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
    <div className="relative space-y-2">
      <Label htmlFor="collaborator-search">Add Collaborators</Label>
      <div className={"flex items-start justify-between gap-x-2"}>
        <div className="flex-1">
          <motion.div
            className={cn(
              "transform-center bg-secondary min-h-10 rounded-md border border-zinc-300 pl-2",
              "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none",
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
                        "flex cursor-pointer items-center justify-center gap-x-2.5 rounded-full border border-zinc-200 bg-zinc-400 px-2 py-1 text-white select-none focus:border-2",
                        selectedCollaborator?._id === collaborator._id &&
                          selectedCollaborator?._id === collaborator._id &&
                          "ring-2 ring-slate-800 ring-offset-2",
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
            <div className={"flex items-center"}>
              <SearchIcon className="h-4! w-4!" />
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
          </motion.div>
        </div>
        <div className={"w-fit"}>
          <Select
            defaultValue={"view"}
            value={role}
            disabled={isPending}
            data-id={selectedCollaborator?._id}
            onValueChange={handleChangeRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose it" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Choose option</SelectLabel>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="view">View</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
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
            className="absolute top-[calc(100%+8px)] max-h-40 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/80"
          >
            <div className="size-full p-2">
              {isPending ? (
                <LucideLoaderCircle className="mx-auto h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <div className={"flex flex-col gap-y-2"} ref={dropdownRef}>
                  {listColl.length > 0 ? (
                    listColl.map((collaborator) => (
                      <TooltipProvider key={collaborator._id}>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddCollaborators({
                                ...collaborator,
                                role: role,
                              });
                            }}
                          >
                            <div className="relative flex w-full items-center rounded-md bg-zinc-300 px-1.5 py-2 transition-colors hover:bg-zinc-400/50">
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
                    ))
                  ) : (
                    <p className="py-3 text-center text-sm text-zinc-500">
                      No collaborators found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCollaboratorInput;
