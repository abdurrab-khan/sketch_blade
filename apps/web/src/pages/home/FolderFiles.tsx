import React from "react";
import { useParams } from "react-router";

function FolderFiles() {
  const { folderId } = useParams();

  return (
    <div className="size-full">
      {folderId}
    </div>
  )
}

export default FolderFiles;
