import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "blog-app-backend-c1w2an7jf-filbertleo88s-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
