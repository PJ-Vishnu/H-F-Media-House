
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

const uploadsDir = path.join(__dirname, 'public', 'uploads');
const serveUploads = serveStatic(uploadsDir);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Check if the request is for an uploaded file
    if (pathname.startsWith('/uploads/')) {
      // Modify the request URL to remove the /uploads prefix for serve-static
      req.url = req.url.replace('/uploads', '');
      return serveUploads(req, res, () => {
        // If serve-static doesn't find a file, let Next.js handle it
        // This will result in a 404 if the file truly doesn't exist
        handle(req, res, parsedUrl);
      });
    }

    // Let Next.js handle all other requests
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
