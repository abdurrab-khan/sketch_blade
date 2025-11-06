export interface ApiResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data?: any;
}

export enum CollaboratorAction {
   Owner = "owner",
   Edit = "edit",
   View = "view",
   Comment = "comment",
}
