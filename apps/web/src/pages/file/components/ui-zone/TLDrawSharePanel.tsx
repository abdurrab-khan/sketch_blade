import { useState } from "react";
import { Share2 } from "lucide-react";
import Share from "../../../../components/dialogs/Share";
import { DialogTrigger } from "@/components/ui/dialog";
import { PeopleMenu } from "tldraw";
import { CollaboratorActions } from "@/types/collaborator";

interface ITLDrawSharePanel {
  role: CollaboratorActions;
}

function TLDrawSharePanel({ role }: ITLDrawSharePanel) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tlui-style-panel my-2.5 mr-2 flex w-fit! max-w-fit! items-center gap-x-1.5">
      <PeopleMenu />
      {role !== "view" && (
        <Share isOpen={isOpen} setIsOpen={setIsOpen}>
          <DialogTrigger className="primary__btn flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm">
            <Share2 size={"18px"} /> Share
          </DialogTrigger>
        </Share>
      )}
    </div>
  );
}

export default TLDrawSharePanel;
