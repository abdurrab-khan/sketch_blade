export interface Folder {
   _id: string;
   folderId: string;
   creator: string;
   createdAt: string;
   updatedAt: string;
}

export declare type CreateFolderRequest = {
   folderName: string;
   files: String[];
};

export declare type UpdateFolderRequest = {
   folderName: string;
};
