import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../../ui/input.tsx";
import { HiPencilAlt } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import { IoMdCheckmark } from "react-icons/io";

interface EditFileProps {
  fileId: string;
  fileName: string;
}

const EditFile: React.FC<EditFileProps> = ({ fileId, fileName = "Untitled" }) => {
  const [inputText, setInputText] = useState(fileName);
  const [isEditable, setIsEditable] = useState(false);
  const input = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsEditable(false);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleEdit = () => {
    if (isSaving) return;
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
    }
  };

  useEffect(() => {
    if (isEditable && input.current) {
      input.current.focus();
    }
  }, [isEditable]);

  return (
    <div className={"hidden items-center gap-x-2 md:flex"}>
      <Input
        ref={input}
        disabled={!isEditable}
        placeholder={"Untitled"}
        value={inputText}
        className={"border-none bg-transparent"}
        onChange={(e) => setInputText(e.target.value)}
        onBlur={handleSave}
      />
      <button onClick={handleEdit}>
        <span className={"text-2xl"}>
          {isSaving ? (
            <Loader2 className={"animate-spin"} />
          ) : isEditable ? (
            <IoMdCheckmark />
          ) : (
            <HiPencilAlt />
          )}
        </span>
      </button>
    </div>
  );
};
export default EditFile;
