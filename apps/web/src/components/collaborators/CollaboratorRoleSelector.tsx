import { debounce } from "lodash";
import { useCallback, useMemo, useTransition } from "react";
import { Collaborator, CollaboratorActions } from "@/types/collaborator";

import { ApiResponse } from "@/types";

import { useToast } from "@/hooks/use-toast";
import useApiClient from "@/hooks/useApiClient";
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectContent,
} from "../ui/select";

interface ICollaboratorRoleSelectorProps {
  fileId: string;
  role: CollaboratorActions;
  selectedCollaborator: Collaborator | null;
  setCurrentRole: React.Dispatch<React.SetStateAction<CollaboratorActions>>;
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
}

function CollaboratorRoleSelector({
  fileId,
  role,
  selectedCollaborator,
  setCurrentRole,
  setSelectedCollaborator,
  setExistingCollaborators,
}: ICollaboratorRoleSelectorProps) {
  const apiClient = useApiClient();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const debounceChangeRole = useMemo(
    () =>
      debounce(async (fileId: string, collaborator: Collaborator, role: CollaboratorActions) => {
        startTransition(async () => {
          try {
            const res = await apiClient.put<ApiResponse>(`/collaborator/change-role/${fileId}`, {
              role,
              collaboratorId: collaborator._id,
            });

            // if successfully role changed we will do update existing collaborator state, toast to show success message
            if (res.data?.success) {
              setExistingCollaborators((prev) =>
                prev.map((coll) => (coll._id === collaborator._id ? { ...coll, role } : coll)),
              );

              toast({
                title: "Success",
                description: `${collaborator.fullName} updated as ${role}`,
              });
            }
          } catch (err) {
            toast({
              title: "Error",
              description: `Failed: To update ${collaborator.fullName} as ${role}, ${(err as Error)?.message ?? ""}`,
              variant: "destructive",
            });
          } finally {
            setSelectedCollaborator(null);
          }
        });
      }, 1000),
    [apiClient, setExistingCollaborators, setSelectedCollaborator, toast],
  );

  // Handle changes on role
  const handleChangeRole = useCallback(
    (role: CollaboratorActions) => {
      setCurrentRole(role);

      // debounce function to change role
      if (selectedCollaborator) {
        debounceChangeRole(fileId, selectedCollaborator, role);
      }
    },
    [debounceChangeRole, fileId, selectedCollaborator, setCurrentRole],
  );

  return (
    <Select
      value={role}
      disabled={isPending}
      defaultValue={"view"}
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
  );
}

export default CollaboratorRoleSelector;
