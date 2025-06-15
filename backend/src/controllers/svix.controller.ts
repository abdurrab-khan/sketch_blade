import { Request, Response } from "express";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { User } from "../models/user.model";
import { CreateUserRequest } from "../types/user";
import { AsyncHandler, ErrorHandler } from "../utils";
import { IErrorHandler } from "../utils/ErrorHandler";

export type ClerkEvent = WebhookEvent;

const createUser = async (userData: CreateUserRequest) => {
   try {
      const newUser = await User.create(userData);

      if (!newUser)
         throw new ErrorHandler({
            message: "failed to create a new user.",
            statusCode: 500,
         });

      return newUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error";
      throw new ErrorHandler({
         message: `Create user failed: ${errorMessage}`,
         statusCode: 500,
      });
   }
};

const updateUser = async (
   clerkId: string,
   updatedUserData: CreateUserRequest,
) => {
   try {
      const userExists = await User.exists({ clerkId });

      if (!userExists) {
         throw new ErrorHandler({
            message: "invalid request, user is not found.",
            statusCode: 400,
         });
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
         throw new ErrorHandler({
            message: "failed to update the user.",
            statusCode: 500,
         });
      }

      return updatedUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error
            ? error.message
            : "Unknown error: during updating of user.";
      throw new ErrorHandler({
         message: `Create user failed: ${errorMessage}`,
         statusCode: 500,
      });
   }
};

const deleteUser = async (clerkId: string) => {
   try {
      const userExists = await User.exists({ clerkId });

      if (!userExists) {
         throw new ErrorHandler({
            message: "user is not found.",
            statusCode: 400,
         });
      }

      const deletedUser = await User.findOneAndDelete({ clerkId });

      if (!deletedUser) {
         throw new ErrorHandler({
            message: "failed to delete the user.",
            statusCode: 500,
         });
      }

      return deletedUser;
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error";
      throw new ErrorHandler({
         message: `create user failed: ${errorMessage}`,
         statusCode: 500,
      });
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
                  primary_email_address_id,
               } = evt.data;

               if (!id) {
                  throw new ErrorHandler({
                     statusCode: 400,
                     message: "missing user id in webhook data.",
                  });
               }

               const primaryEmailAddress =
                  email_addresses.find(
                     (e) => e.id === primary_email_address_id,
                  ) || email_addresses[0];

               if (!primaryEmailAddress?.email_address) {
                  throw new ErrorHandler({
                     statusCode: 400,
                     message: "user must have an email address",
                  });
               }

               const userData = {
                  clerkId: id,
                  email: primaryEmailAddress?.email_address,
                  firstName: first_name,
                  lastName: last_name,
                  profileUrl: image_url,
               } as CreateUserRequest;

               try {
                  let userResponse;
                  if (evt.type === "user.created") {
                     const userExist = await User.exists({
                        clerkId: userData.clerkId,
                     });

                     if (userExist) {
                        console.log(
                           `user ${id} already exists, skipping creation`,
                        );
                        return;
                     }
                     userResponse = await createUser(userData);
                  } else {
                     userResponse = await updateUser(
                        userData.clerkId,
                        userData,
                     );
                  }

                  if (!userResponse) {
                     throw new ErrorHandler({
                        statusCode: 500,
                        message: `failed to ${evt.type.replace(".", " ")} user`,
                     });
                  }
               } catch (err: IErrorHandler | any) {
                  console.error(
                     `Failed to ${evt.type} user:`,
                     err?.message || "Unknown error",
                  );
                  throw new ErrorHandler({
                     statusCode: err?.statusCode || 500,
                     message: `failed to ${evt.type} user: ${err?.message || "Unknown error"}`,
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
               } catch (err: IErrorHandler | any) {
                  console.error(
                     `Failed to ${evt.type} user:`,
                     err?.message || "Unknown error",
                  );
                  throw new ErrorHandler({
                     statusCode: err?.statusCode || 500,
                     message: `failed to ${evt.type} user: ${err?.message || "Unknown error"}`,
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

         return res.status(200).json({
            success: true,
            message: "webhook event processed successfully",
            eventType: evt.type,
            userId: evt.data.id,
         });
      } catch (err: IErrorHandler | any) {
         throw new ErrorHandler({
            statusCode: err?.statusCode || 500,
            message: `Failed to process webhook event: ${err?.message || "Unknown error"}`,
         });
      }
   },
);
