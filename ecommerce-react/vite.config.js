import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 Add this line — MUST match your repo name!
  server: {
    port: 3000,
    host: true,
  },
});
