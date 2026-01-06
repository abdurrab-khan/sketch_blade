import { useState, useEffect } from "react";

import { ApiResponse } from "@/types";
import { Collaborator, CollaboratorActions } from "@/types/collaborator";

import { Label } from "../ui/label";
import CollaboratorRoleSelector from "./CollaboratorRoleSelector";

import { useToast } from "@/hooks/use-toast";
import useApiClient from "@/hooks/useApiClient";
import ShowCollaborators from "./ShowCollaborators";
import SearchUsers from "./SearchUsers";

interface ICollaboratorManagerProps {
  fileId: string;
}

function CollaboratorManager({ fileId }: ICollaboratorManagerProps) {
  const [existingCollaborator, setExistingCollaborator] = useState<Collaborator[]>([]);
  const [currentRole, setCurrentRole] = useState<CollaboratorActions>("view");
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  const apiClient = useApiClient();
  const { toast } = useToast();

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
        <div className="focus-within:ring-ring bg-secondary dark:bg-primary-bg-dark flex-1 rounded-md border border-zinc-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
          <ShowCollaborators
            fileId={fileId}
            setRole={setCurrentRole}
            existingCollaborators={existingCollaborator}
            selectedCollaborator={selectedCollaborator}
            setSelectedCollaborator={setSelectedCollaborator}
            setExistingCollaborators={setExistingCollaborator}
          />
          <SearchUsers
            fileId={fileId}
            role={currentRole}
            existingCollaborators={existingCollaborator}
            setExistingCollaborators={setExistingCollaborator}
            setSelectedCollaborator={setSelectedCollaborator}
          />
        </div>
        <div className="w-fit">
          <CollaboratorRoleSelector
            fileId={fileId}
            role={currentRole}
            setCurrentRole={setCurrentRole}
            selectedCollaborator={selectedCollaborator}
            setSelectedCollaborator={setSelectedCollaborator}
            setExistingCollaborators={setExistingCollaborator}
          />
        </div>
      </div>
    </div>
  );
}

export default CollaboratorManager;
