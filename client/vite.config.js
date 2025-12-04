// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Remove server proxy for production builds
  // It only works in development mode
  server:
    process.env.NODE_ENV !== "production"
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:5009", // Your local backend
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
          },
        }
      : undefined,
});
