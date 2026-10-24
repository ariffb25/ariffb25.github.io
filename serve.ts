import { serve } from "bun";
import { join } from "path";
import { existsSync, statSync } from "fs";

const DIST = "/opt/ariffb-astro/dist";

const server = serve({
  port: 3002,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);
    
    // Default root to index.html
    let filePath = join(DIST, pathname);

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    } else if (!existsSync(filePath) && existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }

    if (existsSync(filePath) && !statSync(filePath).isDirectory()) {
      return new Response(Bun.file(filePath));
    }

    // 404 fallback
    const notFound = join(DIST, "404.html");
    if (existsSync(notFound)) {
      return new Response(Bun.file(notFound), { status: 404 });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Static server running on http://localhost:${server.port}`);
