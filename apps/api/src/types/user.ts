export interface User {
   _id: string;
   firstName: string;
   lastName: string;
   email: string;
   profileUrl: string;
   clerkUserId: string;
   createdAt: string;
   updatedAt: string;
}

export interface CreateUserRequest {
   firstName: string;
   lastName?: string;
   email: string;
   clerkId: string;
   profileUrl?: string;
}

export interface CollaboratorUser {
   _id: string;
   fullName: string;
   email: string;
   profileUrl: string;
}
