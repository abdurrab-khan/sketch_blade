import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
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
        target: "http://sketch-blade-api:8080",
        changeOrigin: true,
        secure: false,
      },
      // "/socket.io": {
      //   target: "http://localhost:8080",
      //   ws: true,
      // },
    },
  },
});
