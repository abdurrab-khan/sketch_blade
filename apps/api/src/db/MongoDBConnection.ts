import mongoose from "mongoose";
import { MONGO_NAME } from "@/lib/constants";

class MongoDBConnection {
   private mongoUri: string;
   private mongooseConnection: typeof mongoose;

   constructor() {
      this.mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
      this.mongooseConnection = mongoose;
   }

   async connect() {
      try {
         await this.connectMongoDB();
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

   async disconnect() {
      try {
         await this.mongooseConnection.disconnect();
         console.log("MongoDB disconnected");
      } catch (error) {
         console.error("Error during disconnection:", error);
      }
   }

   getMongoClient() {
      return this.mongooseConnection;
   }
}

export default new MongoDBConnection();
