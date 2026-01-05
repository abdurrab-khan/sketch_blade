import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import CollaboratorManager from "../collaborators/CollaboratorManager";

interface ICollaboratorProps {
  isOpen: boolean;
  fileId: string;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Collaborators({ isOpen, setIsOpen, fileId, children }: ICollaboratorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-2xl">
            Manege Collaborators
          </DialogTitle>
        </DialogHeader>
        <CollaboratorManager fileId={fileId} />
      </DialogContent>
    </Dialog>
  );
}

export default Collaborators;
