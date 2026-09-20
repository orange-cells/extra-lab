export default (express, zlib, multer) => {
    const app = express();
    const upload = multer({ storage: multer.memoryStorage() });

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers',
            'Content-Type, Accept, ngrok-skip-browser-warning, Authorization, x-test, Access-Control-Allow-Headers');
        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }
        next();
    });

    app.get(['/login', '/login/'], (req, res) => {
        res.send('orangecells_1');
    });

    const sendGzip = (buffer, res) => {
        zlib.gzip(buffer, (gzErr, gzippedData) => {
            if (gzErr) {
                return res.status(500).send('orangecells_1');
            }
            res.setHeader('Content-Type', 'application/gzip');
            res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
            return res.send(gzippedData);
        });
    };

    app.post(['/zipper', '/zipper/'], (req, res) => {
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data')) {
            upload.any()(req, res, (err) => {
                if (err) {
                    return res.status(500).send('orangecells_1');
                }
                if (req.files && req.files.length > 0 && req.files[0].buffer) {
                    return sendGzip(req.files[0].buffer, res);
                }
                if (req.file && req.file.buffer) {
                    return sendGzip(req.file.buffer, res);
                }
                return res.status(400).send('orangecells_1');
            });
        } else {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
                const rawBuffer = Buffer.concat(chunks);
                if (rawBuffer.length > 0) {
                    return sendGzip(rawBuffer, res);
                }
                return res.status(400).send('orangecells_1');
            });
            req.on('error', () => {
                return res.status(500).send('orangecells_1');
            });
        }
    });

    app.all(/.*/, (req, res) => {
        res.send('orangecells_1');
    });

    return app;
};
