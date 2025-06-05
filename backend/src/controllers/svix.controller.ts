import { Request, Response } from "express";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { User } from "../models/user.model";
import { CreateUserRequest } from "../types/user";
import { AsyncHandler, ErrorHandler } from "../utils";

export type ClerkEvent = WebhookEvent;

const createUser = async (userData: CreateUserRequest) => {
   try {
      const newUser = await User.create(userData);

      if (!newUser) throw new Error("failed to create a new user.");
      return newUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Create user failed: ${errorMessage}`);
   }
};

const updateUser = async (
   clerkId: string,
   updatedUserData: CreateUserRequest,
) => {
   try {
      const userExists = await User.exists({ clerkId });

      if (!userExists) {
         throw new Error("user is not found.");
      }

      const updatedUser = await User.findOneAndUpdate(
         {
            clerkId,
         },
         {
            $set: updatedUserData,
         },
         { new: true },
      );

      if (!updatedUser) {
         throw new Error("failed to update the user.");
      }

      return updatedUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error
            ? error.message
            : "Unknown error: during updating of user.";
      throw new Error(`Create user failed: ${errorMessage}`);
   }
};

const deleteUser = async (clerkId: string) => {
   try {
      const userExists = await User.exists({ clerkId });

      if (!userExists) {
         throw new Error("user is not found.");
      }

      const deletedUser = await User.findByIdAndDelete(clerkId);

      if (!deletedUser) {
         throw new Error("failed to delete the user.");
      }

      return deletedUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Create user failed: ${errorMessage}`);
   }
};

export const svixController = AsyncHandler(
   async (req: Request, res: Response): Promise<any> => {
      try {
         const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

         if (!CLERK_SIGNING_SECRET) {
            throw new Error("missing CLERK_SIGNING_SECRET env variable");
         }

         const wh = new Webhook(CLERK_SIGNING_SECRET);
         const headers = req.headers;
         const payload = Buffer.isBuffer(req.body)
            ? req.body
            : Buffer.from(JSON.stringify(req.body));

         const svix_id = headers["svix-id"] as string;
         const svix_timestamp = headers["svix-timestamp"] as string;
         const svix_signature = headers["svix-signature"] as string;

         if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({
               success: false,
               message: "Missing required Svix headers",
            });
         }

         const evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
         } as WebhookRequiredHeaders) as ClerkEvent;

         switch (evt.type) {
            case "user.created":
            case "user.updated": {
               const {
                  id,
                  first_name,
                  last_name,
                  image_url = "",
                  email_addresses = [],
               } = evt.data;

               const userData = {
                  clerkId: id,
                  email: email_addresses[0]?.email_address,
                  firstName: first_name,
                  lastName: last_name,
                  profileUrl: image_url,
               } as CreateUserRequest;

               try {
                  let userResponse;
                  if (evt.type === "user.created") {
                     userResponse = await createUser(userData);
                  } else {
                     userResponse = await updateUser(id, userData);
                  }

                  if (!userResponse) {
                     throw new ErrorHandler({
                        statusCode: 500,
                        message: `failed to ${evt.type} user`,
                     });
                  }
               } catch (error) {
                  console.error(`Failed to ${evt.type} user:`, error);
                  throw new ErrorHandler({
                     statusCode: 500,
                     message: `failed to ${evt.type} user`,
                  });
               }
               break;
            }
            case "user.deleted": {
               try {
                  const delResponse = await deleteUser(evt.data.id as string);

                  if (!delResponse) {
                     throw new ErrorHandler({
                        statusCode: 500,
                        message: "failed to delete user",
                     });
                  }
               } catch (error) {
                  console.error(`Failed to ${evt.type} user:`, error);
                  throw new ErrorHandler({
                     statusCode: 500,
                     message: `failed to ${evt.type} user`,
                  });
               }
               break;
            }

            default:
               console.warn(`Unhandled event type: ${evt.type}`);
               throw new ErrorHandler({
                  statusCode: 400,
                  message: `Unhandled event type: ${evt.type}`,
               });
         }

         console.log(
            `Processed event: ${evt.type} for user ID: ${evt.data.id}`,
         );
         return res.status(200).json({
            success: true,
            message: "webhook event processed successfully",
            eventType: evt.type,
            userId: evt.data.id,
         });
      } catch (err) {
         throw new ErrorHandler({
            statusCode: 500,
            message: `Failed to process webhook event: ${err instanceof Error ? err.message : "Unknown error"}`,
         });
      }
   },
);
