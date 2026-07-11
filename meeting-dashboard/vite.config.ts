import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "victory-vendor/d3-shape": path.resolve(__dirname, "node_modules/victory-vendor/es/d3-shape.js"),
      "victory-vendor/d3-scale": path.resolve(__dirname, "node_modules/victory-vendor/es/d3-scale.js"),
      "victory-vendor/d3-array": path.resolve(__dirname, "node_modules/victory-vendor/es/d3-array.js"),
      "victory-vendor/d3-interpolate": path.resolve(__dirname, "node_modules/victory-vendor/es/d3-interpolate.js"),
    },
  },
});
