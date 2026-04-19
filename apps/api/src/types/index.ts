export interface ApiResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data?: any;
}

export enum CollaboratorAction {
   Edit = "edit",
   View = "view",
   Comment = "comment",
}

export interface ServerToClientMessage {
   "tldraw-message": (message: string) => void;
}

export interface ClientToServerMessage {
   "tldraw-message": (message: string) => void;
}
