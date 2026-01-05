import { useState, useEffect } from "react";

import { ApiResponse } from "@/types";
import { Collaborator, CollaboratorActions } from "@/types/collaborator";

import { Label } from "../ui/label";
import CollaboratorRoleSelector from "./CollaboratorRoleSelector";

import { useToast } from "@/hooks/use-toast";
import useApiClient from "@/hooks/useApiClient";
import CollaboratorInput from "./CollaboratorInput";
import SearchUsers from "./SearchUsers";

interface ICollaboratorManagerProps {
  fileId: string;
}

function CollaboratorManager({ fileId }: ICollaboratorManagerProps) {
  const [existingCollaborator, setExistingCollaborator] = useState<Collaborator[]>([]);
  const [currentRole, setCurrentRole] = useState<CollaboratorActions>("view");

  const apiClient = useApiClient();
  const { toast } = useToast();

  // Handle on role change
  const handleChangeRole = (role: CollaboratorActions) => {
    setCurrentRole(role);
  };

  // Fetching existing collaborators
  useEffect(() => {
    const fetchCollaborators = async (): Promise<Collaborator[]> => {
      try {
        const collaboratorRes = await apiClient.get<ApiResponse<Collaborator[]>>(
          `/collaborator/${fileId}`,
        );
        return collaboratorRes.data?.data ?? [];
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error)?.message ?? "Failed to fetch existing collaborators",
          variant: "destructive",
        });
        return [];
      }
    };
    fetchCollaborators().then((coll) => setExistingCollaborator(coll));
  }, [apiClient, fileId, toast]);

  return (
    <div className="relative space-y-2">
      <Label htmlFor="collaborator-search">Add Collaborators</Label>
      <div className={"flex items-start justify-between gap-x-2"}>
        <div className="flex-1">
          <CollaboratorInput
            fileId={fileId}
            role={currentRole}
            exisitingCollaborators={existingCollaborator}
          />
          <SearchUsers />
        </div>
        <div className="w-fit">
          <CollaboratorRoleSelector role={currentRole} onValueChange={handleChangeRole} />
        </div>
      </div>
    </div>
  );
}

export default CollaboratorManager;
