import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_PROXY_TARGET = process.env["VITE_API_URL"] ?? "http://localhost:8080";

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
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite(path) {
          return path.replace("/api", "");
        },
      },
      "/socket.io": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
