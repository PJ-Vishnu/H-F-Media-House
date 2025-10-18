const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const serveStatic = require('serve-static');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

// Middleware to serve static files from the 'public' directory
const staticServer = serveStatic(path.join(__dirname, 'public'));

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Check if the request is for an uploaded file
    if (pathname.startsWith('/uploads/')) {
      // Let serve-static handle it. It will serve the file from the public directory.
      return staticServer(req, res, () => {
        // If serve-static doesn't find the file, it passes control here.
        // We then let Next.js try to handle it, which will likely result in a 404 page.
        handle(req, res, parsedUrl);
      });
    }

    // For all other requests, let Next.js handle them
    handle(req, res, parsedUrl);
    
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
