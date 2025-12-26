/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "98-components",
      fileName: (format, entryName) => `98comp-${entryName}.${format}.js`,
      cssFileName: "98comp",
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^98\.css/],
      output: {
        globals: {
          "98.css": "98.css",
        },
      },
    },
    target: "es2022",
  },
});
