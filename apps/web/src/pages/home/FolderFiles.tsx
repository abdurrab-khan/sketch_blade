import React from "react";
import { useParams } from "react-router";

function FolderFiles() {
  const { folderId } = useParams();

  return <div>This is folder files {folderId} </div>;
}

export default FolderFiles;
