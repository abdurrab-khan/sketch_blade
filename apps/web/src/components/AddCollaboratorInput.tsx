import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { LucideLoaderCircle, SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import * as z from "zod";
import { debounce } from "lodash";
import { cn } from "../lib/utils.ts";
import { ApiResponse } from "@/types/index.ts";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import useApiClient from "@/hooks/useApiClient.ts";
import { CollaboratorActions, Collaborator, ListCollaborator } from "../types/collaborator.ts";
import { useToast } from "@/hooks/use-toast.ts";

interface AddCollaboratorInputProps {
  watch: UseFormWatch<z.infer<typeof fileSchema>>;
  removedColl?: string[];
  newlyAddedColl?: string[];
  setValue: UseFormSetValue<z.infer<typeof fileSchema>>;
  setRemoveColl?: React.Dispatch<React.SetStateAction<string[]>>;
  setNewlyAddedColl?: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddCollaboratorInput: React.FC<AddCollaboratorInputProps> = ({
  watch,
  removedColl,
  newlyAddedColl,
  setValue,
  setRemoveColl,
  setNewlyAddedColl,
}) => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [listColl, setListColl] = useState<ListCollaborator[]>([]);
  const [role, setRole] = useState<CollaboratorActions>("view" as CollaboratorActions);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  const collaborators = watch("collaborators") || [];

  const dropdownRef = useRef<HTMLDivElement>(null);

  const apiClient = useApiClient();
  const { toast } = useToast();

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

  const handleAddCollaborators = (collaboratorData: Collaborator) => {
    if (collaborators.some((coll) => coll._id === collaboratorData._id)) return;

    setValue("collaborators", [
      {
        ...collaboratorData,
      },
    ]);

    // add new collaborators
    if (typeof setNewlyAddedColl === "function" && typeof setRemoveColl === "function") {
      // only add if coll is not in removed coll -- if there means they already there in db
      if (!removedColl?.some((id) => id === collaboratorData._id)) {
        setNewlyAddedColl((prev) => [...prev, collaboratorData._id]);
      } else {
        setRemoveColl((ids) => ids.filter((id) => id !== collaboratorData._id));
      }
    }

    // RESET INPUT AND LIST
    setEmail("");
    setListColl([]);
  };

  const handleRemoveCollaborators = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const collaboratorId = e.currentTarget.dataset.id;
    if (!collaboratorId) return;

    const updatedCollaborators = collaborators?.filter((coll) => coll._id !== collaboratorId);

    // adding and removing collaborators
    if (typeof setRemoveColl === "function" && typeof setNewlyAddedColl === "function") {
      // only add if coll is not in newlyAddedColl -- if there mean they are not in db
      if (!newlyAddedColl?.some((id) => id === collaboratorId)) {
        setRemoveColl((prev) => [...prev, collaboratorId]);
      } else {
        setNewlyAddedColl((prev) => prev.filter((id) => id !== collaboratorId));
      }
    }

    setValue("collaborators", updatedCollaborators);
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
                        data-id={collaborator._id}
                        onClick={handleRemoveCollaborators}
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
