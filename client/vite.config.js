import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src",

  server: {
    port: 3001,
    open: true,
    host: true,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "clsx", "urql", "chancets2", "graphql", "tailwindcss"],
  },
});
