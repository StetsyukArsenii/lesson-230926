const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = express();
const adsPath = path.join(__dirname, 'ads.json');

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/ads', async (req, res) => {
    const ads = JSON.parse(await fs.readFile(adsPath, 'utf8'));
    res.json(ads);
});

app.post('/add', async (req, res) => {
    const { title, description } = req.body;

    if (typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    const ads = JSON.parse(await fs.readFile(adsPath, 'utf8'));
    const ad = { title: title.trim(), description: description.trim() };
    ads.push(ad);
    await fs.writeFile(adsPath, `${JSON.stringify(ads, null, 2)}\n`, 'utf8');

    res.status(201).json(ad);
});


app.use((req, res, next) => {
    res.status(404);
    res.render('notfound');
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
});