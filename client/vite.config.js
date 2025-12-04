import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://blog-app-backend-9qciw2ji2-filbertleo88s-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
