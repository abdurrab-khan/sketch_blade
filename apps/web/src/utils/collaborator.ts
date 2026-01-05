import { CollaboratorZodSchema } from "@/lib/zod/schemas";

const collaboratorBuilder = (collab: CollaboratorZodSchema) => ({
  _id: collab._id,
  fullName: collab.fullName,
  email: collab.email,
  profileUrl: collab.profileUrl,
  role: collab.role,
});

export { collaboratorBuilder };
