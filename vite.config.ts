import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@composables": fileURLToPath(
        new URL("./src/composables", import.meta.url),
      ),
      "@plugins": fileURLToPath(new URL("./src/plugins", import.meta.url)),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
    },
  },
});
