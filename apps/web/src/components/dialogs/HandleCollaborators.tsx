import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import CollaboratorManager from "../collaborators/CollaboratorManager";

interface ICollaboratorProps {
  isOpen: boolean;
  fileId: string;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function HandleCollaborators({ isOpen, setIsOpen, fileId, children }: ICollaboratorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-2xl">
            Manage Collaborators
          </DialogTitle>
          <DialogDescription>
            Add collaborators to this file and control who can access it.
          </DialogDescription>
        </DialogHeader>
        <div className="min-w-full">
          <CollaboratorManager fileId={fileId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HandleCollaborators;
