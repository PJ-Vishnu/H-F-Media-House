
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const serveStatic = require('serve-static');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Point serve-static to the 'public' directory
const staticServe = serveStatic(path.join(__dirname, 'public'));

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // If the request is for a file in /uploads, let serve-static handle it.
    // It will look inside the 'public' directory, so the path /uploads/... works directly.
    if (pathname.startsWith('/uploads/')) {
      return staticServe(req, res, () => {
        // If the file is not found by serve-static, let Next.js handle it (which will likely be a 404).
        handle(req, res, parsedUrl);
      });
    }

    // For all other requests, let Next.js handle them.
    handle(req, res, parsedUrl);

  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
