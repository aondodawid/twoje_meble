const fs = require("fs");
const http = require("http");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const rootDir = path.resolve(__dirname, "..", "dist");
const pidFilePath = path.resolve(__dirname, "..", ".serve-dist.pid");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getCacheControl(filePath) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");

  if (
    relativePath === "index.html" ||
    relativePath === "service-worker.js" ||
    relativePath.endsWith(".html")
  ) {
    return "no-cache";
  }

  if (relativePath.endsWith(".json")) {
    return "public, max-age=3600, stale-while-revalidate=86400";
  }

  return "public, max-age=31536000, immutable";
}

function resolvePath(urlPathname) {
  const normalizedPath = decodeURIComponent(urlPathname.split("?")[0]);
  const requestedPath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const resolvedPath = path.resolve(rootDir, `.${requestedPath}`);

  if (!resolvedPath.startsWith(rootDir)) {
    return null;
  }

  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    return resolvedPath;
  }

  return path.join(rootDir, "index.html");
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": getCacheControl(filePath),
    });
    response.end(file);
  });
});

function cleanupPidFile() {
  if (!fs.existsSync(pidFilePath)) {
    return;
  }

  const storedPid = Number(fs.readFileSync(pidFilePath, "utf8"));

  if (storedPid === process.pid) {
    fs.unlinkSync(pidFilePath);
  }
}

function shutdown(exitCode) {
  server.close(() => {
    cleanupPidFile();
    process.exit(exitCode);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("exit", cleanupPidFile);

server.listen(port, host, () => {
  fs.writeFileSync(pidFilePath, String(process.pid));
  console.log(`Available on: http://${host}:${port}`);
});
