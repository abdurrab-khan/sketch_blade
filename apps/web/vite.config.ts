import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api/v1": {
        target: "http://api:8080",
        changeOrigin: true,
        secure: false,
        rewrite(path){
          return path.replace("/api", "")
        } 
      },
      "/socket.io": {
        target: "http://api:8080",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
