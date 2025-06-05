export interface ApiResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data?: any;
}

export enum CollaboratorAction {
   Owner = "owner",
   Edit = "editor",
   View = "viewer",
   Comment = "commenter",
}
