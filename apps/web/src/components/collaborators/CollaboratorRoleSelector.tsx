import { CollaboratorActions } from "@/types/collaborator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@radix-ui/react-select";

interface ICollaboratorRoleSelectorProps {
  role: CollaboratorActions;
  onValueChange: (value: CollaboratorActions) => void;
}

function CollaboratorRoleSelector({ role, onValueChange }: ICollaboratorRoleSelectorProps) {
  return (
    <Select defaultValue={"view"} value={role} onValueChange={onValueChange}>
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
