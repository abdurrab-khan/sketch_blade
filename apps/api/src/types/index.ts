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
