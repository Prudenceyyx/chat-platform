import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  root: "src",
  server: {
    port: 3001,
    open: true,
    host: true,
  },
  build: {
    assetsDir: ".",
    assetsInclude: ["**/*.css", "**/*.js"],
    outDir: path.resolve("./dist"),
    emptyOutDir: true,
    manifest: false,
    assetFileNames: "assets/[name].[ext]", // Output files without hash
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "clsx", "urql", "chancets2", "graphql", "tailwindcss"],
  },
});
