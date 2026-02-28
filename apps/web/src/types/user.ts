export interface User {
  _id: string;
  name: string;
  email: string;
  clerkId: string;
}

export interface Owner {
  _id?: string;
  fullName: string;
  profileUrl: string;
  email: string;
}
