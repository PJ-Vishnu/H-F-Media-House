
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

const staticServe = serveStatic(path.join(__dirname, 'public'));

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith('/uploads/')) {
      return staticServe(req, res, () => {
        handle(req, res, parsedUrl);
      });
    }

    handle(req, res, parsedUrl);

  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
