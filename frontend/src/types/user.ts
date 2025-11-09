export interface User {
  _id: string;
  name: string;
  email: string;
  clerkId: string;
}

export interface CreatorDetails {
  _id?: string;
  fullName: string;
  profileUrl: string;
}
