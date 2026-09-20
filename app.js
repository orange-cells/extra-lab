export default (express, zlib, multer) => {
    const app = express();
    const upload = multer({ storage: multer.memoryStorage() });

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers',
            'Content-Type, Accept, ngrok-skip-browser-warning, \
            Authorization, x-test, Access-Control-Allow-Headers');
        next();
    });

    app.get('/login/', (req, res) => {
        res.send('orangecells_1');
    });

    app.post('/zipper/', upload.any(), (req, res) => {
        if (req.files && req.files.length > 0) {
            zlibModule.gzip(req.files[0], (gzErr, gzippedData) => {
                if (gzErr) {
                    return res.status(500);
                }
                res.setHeader('Content-Type', 'application/gzip');
                res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
                res.send(gzippedData);
            });
        }

        if (req.file && req.file.buffer) {
            zlibModule.gzip(req.file.buffer, (gzErr, gzippedData) => {
                if (gzErr) {
                    return res.status(500);
                }
                res.setHeader('Content-Type', 'application/gzip');
                res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
                res.send(gzippedData);
            });
        }
    });

    app.all('*', (req, res) => {
        res.send('orangecells_1');
    });

    return app;
};
