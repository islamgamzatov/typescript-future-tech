import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/typescript-future-tech/", // обязательно для GitHub Pages

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        news: resolve(__dirname, "news.html"),
        podcasts: resolve(__dirname, "podcasts.html"),
        contacts: resolve(__dirname, "contacts.html"),
        blog: resolve(__dirname, "blog.html"),
        resources: resolve(__dirname, "resources.html"),
        // добавьте все остальные .html-файлы, которые должны попасть в dist
      },
    },
  },
});
