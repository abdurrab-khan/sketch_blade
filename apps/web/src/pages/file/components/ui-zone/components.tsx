import { TLComponents } from "tldraw";
import TLDrawSharePanel from "./TLDrawSharePanel";
import { CollaboratorActions } from "@/types/collaborator";

export default function Components(role: CollaboratorActions): TLComponents {
  return {
    SharePanel: () => <TLDrawSharePanel role={role} />,
  };
}
