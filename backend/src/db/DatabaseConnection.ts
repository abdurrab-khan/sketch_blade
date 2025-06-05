import mongoose from "mongoose";
import { MONGO_NAME } from "../lib/constants";
import { createClient } from "redis";

class DatabaseConnection {
   private mongoUri: string;
   private redisUrl: string;
   private mongooseConnection: typeof mongoose;
   private redisClient: ReturnType<typeof createClient>;

   constructor() {
      this.mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
      this.redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
      this.mongooseConnection = mongoose;
      this.redisClient = createClient({
         socket: {
            port: Number(process.env.REDIS_PORT) || 6379,
            host: process.env.REDIS_HOST || "localhost",
            reconnectStrategy: (retries) => {
               this.redisClient.on("error", (error) => {
                  if (error.code === "ECONNREFUSED") {
                     console.error("The server refused the connection");
                     return new Error("The server refused the connection");
                  }
               });
               if (retries > 300) {
                  console.error("Retry time exhausted");
                  return new Error("Retry time exhausted");
               }
               return Math.min(retries * 100, 3000);
            },
         },
         password: "Abdul1234",
      });
   }

   async connect() {
      try {
         await this.connectMongoDB();

         await this.connectRedis();

         return this;
      } catch (error) {
         console.error("Database connection error:", error);
         await this.disconnect();
         throw error;
      }
   }

   private async connectMongoDB() {
      try {
         await this.mongooseConnection.connect(this.mongoUri, {
            dbName: MONGO_NAME,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
         });
         console.log(`MongoDB connected: ${this.mongoUri}`);
      } catch (error) {
         console.error("MongoDB connection error:", error);
         throw error;
      }
   }

   private async connectRedis() {
      this.redisClient.on("error", (err) => {
         console.error("Redis Client Error", err);
         console.error("Error Details:", {
            message: err.message,
            code: err.code,
            syscall: err.syscall,
            hostname: err.hostname,
         });
      });

      try {
         await this.redisClient.connect();
         console.log("Redis connected successfully");
      } catch (error) {
         console.error("Redis connection error:", error);
         throw error;
      }
   }

   async disconnect() {
      try {
         await this.mongooseConnection.disconnect();
         console.log("MongoDB disconnected");

         await this.redisClient.quit();
         console.log("Redis disconnected");
      } catch (error) {
         console.error("Error during disconnection:", error);
      }
   }

   getMongoClient() {
      return this.mongooseConnection;
   }

   getRedisClient() {
      return this.redisClient;
   }
}

export default new DatabaseConnection();
