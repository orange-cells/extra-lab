export default (express, zlib, multer) => {
  const app = express();
  const LOGIN = 'orangecells_1';
  const upload = multer({ storage: multer.memoryStorage() });

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, ngrok-skip-browser-warning, Authorization, x-test, Access-Control-Allow-Headers'
    );
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  app.get(['/login', '/login/'], (req, res) => {
    res.send(LOGIN);
  });

  const sendGzip = (buf, res) => {
    zlib.gzip(buf, (gzErr, gzippedData) => {
      if (gzErr) {
        return res.status(500).send(LOGIN);
      }
      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
      res.send(gzippedData);
    });
  };

  app.post(['/zipper', '/zipper/'], (req, res) => {
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      upload.any()(req, res, (err) => {
        if (err) {
          return res.status(500).send(LOGIN);
        }
        if (req.files && req.files.length > 0 && req.files[0].buffer) {
          return sendGzip(req.files[0].buffer, res);
        }
        if (req.file && req.file.buffer) {
          return sendGzip(req.file.buffer, res);
        }
        res.status(400).send(LOGIN);
      });
    } else {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        if (rawBuffer.length > 0) {
          return sendGzip(rawBuffer, res);
        }
        res.status(400).send(LOGIN);
      });
      req.on('error', () => {
        res.status(500).send(LOGIN);
      });
    }
  });

  app.all(/.*/, (req, res) => {
    res.send(LOGIN);
  });

  return app;
};
