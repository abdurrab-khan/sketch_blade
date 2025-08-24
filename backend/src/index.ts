import server from "./server";
import databaseConnection from "./db/DatabaseConnection";

databaseConnection
   .connect()
   .then(() => {
      const PORT = Number(process.env.PORT) || 5000;

      server.listen(PORT, "0.0.0.0", () => {
         console.log(
            `Server running on port ${PORT} 🚀 || http://localhost:${PORT}`,
         );
      });
   })
   .catch((error) => {
      console.error("Server error:", error);
      process.exit(1);
   });
