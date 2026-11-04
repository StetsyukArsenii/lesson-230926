const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const multer = require('multer');

const app = express();
const adsPath = path.join(__dirname, 'ads.json');
const uploadsPath = path.join(__dirname, 'uploads');

app.use(express.static(path.join(__dirname, 'static'), { index: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadsPath),
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new Error('Only image files are allowed'));
        }
        callback(null, true);
    }
});

async function readAds() {
    return JSON.parse(await fs.readFile(adsPath, 'utf8'));
}

app.get('/', async (req, res) => {
    try {
        res.render('index', { products: await readAds() });
    } catch (error) {
        console.error('Could not load products:', error);
        res.status(500).send('Could not load products');
    }
});

app.get('/ads', async (req, res) => {
    try {
        res.json(await readAds());
    } catch (error) {
        console.error('Could not load products:', error);
        res.status(500).json({ error: 'Could not load products' });
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const products = await readAds();
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId) || productId < 0 || !products[productId]) {
            return res.status(404).render('notfound');
        }
        res.render('post', { products: products[productId] });
    } catch (error) {
        console.error('Could not load product:', error);
        res.status(500).send('Could not load product');
    }
});

app.post('/add', upload.array('image'), async (req, res) => {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const images = req.files || [];

    if (!title || !description || images.length === 0) {
        return res.status(400).json({ error: 'Title, description, and at least one image are required' });
    }

    try {
        const products = await readAds();
        const product = {
            title,
            description,
            image: images.map((file) => file.filename)
        };
        products.push(product);
        await fs.writeFile(adsPath, JSON.stringify(products, null, 2));
        res.status(201).json(product);
    } catch (error) {
        console.error('Could not save product:', error);
        res.status(500).json({ error: 'Could not save product' });
    }
});

app.use((req, res) => {
    res.status(404).render('notfound');
});

async function start() {
    await fs.mkdir(uploadsPath, { recursive: true });
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
}

start().catch((error) => {
    console.error('Could not start server:', error);
    process.exitCode = 1;
});
