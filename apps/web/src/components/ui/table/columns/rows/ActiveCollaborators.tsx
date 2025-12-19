import ProfileImg from "@/components/ProfileImg";
import type { ActiveCollaborators } from "@/types/collaborator";

function ActiveCollaborators() {
  // TODO: Later add active collaborators feature
  return null;

  return (
    <div className="flex space-x-4">
      {collaborators.slice(0, 3).map((collaborator, index) => (
        <div
          key={collaborator._id || index}
          className="relative overflow-hidden rounded-full"
          style={{ zIndex: 3 - index }}
        >
          <ProfileImg
            profileUrl={collaborator.details.profileUrl}
            fullName={collaborator.details.fullName}
          />
        </div>
      ))}
    </div>
  );
}

export default ActiveCollaborators;
