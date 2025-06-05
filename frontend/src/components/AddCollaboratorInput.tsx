import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { AnimatePresence, motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label.tsx";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "./ui/input.tsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { debounce } from "lodash";
import { cn } from "../lib/utils.ts";
import { CollaboratorActions, CollaboratorData, ListCollaborator } from "../types/user.ts";

interface AddCollaboratorInputProps {
  collaborators: CollaboratorData[];
  setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorData[]>>;
}

const AddCollaboratorInput: React.FC<AddCollaboratorInputProps> = ({
  collaborators,
  setCollaborators,
}) => {
  const [listColl, setListColl] = useState<ListCollaborator[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [role, setRole] = useState<CollaboratorActions>(
    "view" as CollaboratorActions,
  );
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<CollaboratorData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { email } = useSelector((state: RootState) => state.auth);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: { email: string; current_email: string }) => {
        try {
          const response = await axios.post("/api/users", searchTerm);
          if (response.data.statusCode === 200) {
            if (
              Array.isArray(response.data.data) &&
              response.data.data.length
            ) {
              setListColl(response.data.data);
            } else {
              setListColl([]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 700),
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchItem = e.target.value;
      setInputSearch(searchItem);
      debouncedSearch({ email: searchItem, current_email: email });
    },
    [debouncedSearch, email],
  );

  const handleAddCollaborators = (collaboratorData: CollaboratorData) => {
    const isAlreadySelected = collaborators.some(
      (coll) => coll._id === collaboratorData._id,
    );

    if (isAlreadySelected) return;

    setCollaborators((prevColl) => [...prevColl, collaboratorData]);

    setListColl([]);
    setInputSearch("");
  };

  const handleChangeRole = (_id: string, role: CollaboratorActions) => {
    setCollaborators((prevColl) =>
      prevColl.map((coll) =>
        coll._id === _id ? { ...coll, actions: role } : coll,
      ),
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setCollaborators((prevColl) =>
                            prevColl.filter(
                              (coll) => coll._id !== collaborator._id,
                            ),
                          );
                        }}
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
                value={inputSearch}
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
            onValueChange={(value) => {
              if (selectedCollaborator) {
                handleChangeRole(
                  selectedCollaborator._id,
                  value as CollaboratorActions,
                );
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
        <AnimatePresence>
          {listColl.length > 0 && (
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
              <div className={"flex flex-col gap-y-2"} ref={dropdownRef}>
                {listColl.map((collaborator) => (
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
                            <p>
                              Click to add {collaborator.fullName} as a
                              collaborator
                            </p>
                          </TooltipContent>
                        </div>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddCollaboratorInput;
