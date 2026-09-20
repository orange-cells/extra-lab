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
        let fileBuffer = null;

        if (req.files && req.files.length > 0) {
            fileBuffer = req.files[0].buffer;
        } else if (Buffer.isBuffer(req.body)) {
            fileBuffer = req.body;
        }

        if (!fileBuffer) {
            return res.status(400).send('orangecells_1');
        }

        zlib.gzip(fileBuffer, (err, gzippedData) => {
            res.setHeader('Content-Type', 'application/gzip');
            res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
            res.send(gzippedData);
        });
    });

    app.all('*', (req, res) => {
        res.send('orangecells_1');
    });

    return app;
};
