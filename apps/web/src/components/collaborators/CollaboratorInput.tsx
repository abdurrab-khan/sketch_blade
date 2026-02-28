import React, { useState, useTransition } from "react";
import ShowCollaborators from "./ShowCollaborators";
import { Collaborator, CollaboratorActions, SearchUser } from "@/types/collaborator";
import SearchUsers from "./SearchUsers";
import ShowSearchedUser from "./ShowSearchUser";

interface ICollaboratorInputProps {
  fileId: string;
  role: CollaboratorActions;
  existingCollaborators: Collaborator[];
  selectedCollaborator: Collaborator | null;
  setRole: React.Dispatch<React.SetStateAction<CollaboratorActions>>;
  setExistingCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setSelectedCollaborator: React.Dispatch<React.SetStateAction<Collaborator | null>>;
}

function CollaboratorInput({
  fileId,
  role,
  existingCollaborators,
  selectedCollaborator,
  setRole,
  setExistingCollaborators,
  setSelectedCollaborator,
}: ICollaboratorInputProps) {
  const [email, setEmail] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<SearchUser[]>([]);
  const [isPending, startTransition] = useTransition();

  return (
    <React.Fragment>
      <div className="focus-within:ring-ring bg-secondary dark:bg-primary-bg-dark size-full rounded-md border border-zinc-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
        <ShowCollaborators
          fileId={fileId}
          setRole={setRole}
          existingCollaborators={existingCollaborators}
          selectedCollaborator={selectedCollaborator}
          setSelectedCollaborator={setSelectedCollaborator}
          setExistingCollaborators={setExistingCollaborators}
        />
        <SearchUsers
          email={email}
          searchedUsers={searchedUsers}
          startTransition={startTransition}
          existingCollaborators={existingCollaborators}
          setEmail={setEmail}
          setSearchedUsers={setSearchedUsers}
          setSelectedCollaborator={setSelectedCollaborator}
        />
        {email.length > 0 && (
          <ShowSearchedUser
            fileId={fileId}
            role={role}
            isPending={isPending}
            searchedUsers={searchedUsers}
            existingCollaborators={existingCollaborators}
            setSearchedUsers={setSearchedUsers}
            setExistingCollaborators={setExistingCollaborators}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default CollaboratorInput;
