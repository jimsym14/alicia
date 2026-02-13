import { file } from "bun";
import { resolve, extname } from "path";

const publicDir = import.meta.dir;

const mimeTypes = {
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".html": "text/html",
  ".js": "application/javascript",
  ".jsx": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
};

export default {
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = resolve(publicDir, "." + url.pathname);

    // Security: prevent directory traversal
    if (!filePath.startsWith(publicDir)) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      const f = file(filePath);
      const exists = await f.exists();
      if (exists) {
        const ext = extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";
        const data = await f.arrayBuffer();
        return new Response(data, {
          headers: { "Content-Type": contentType },
        });
      }
    } catch (e) {
      console.error("Error serving file:", filePath, e);
    }

    // Serve index.html for root
    if (url.pathname === "/") {
      return new Response(file(resolve(publicDir, "index.html")), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },

  port: 3000,
};
