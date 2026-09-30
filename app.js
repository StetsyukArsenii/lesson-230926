const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const dataFile = path.join(__dirname, 'ads.json');

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

let products = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    : [];

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.sendFile("index.html", { root: __dirname + "/static" });

});

app.get('/ads', (req, res) => {
    res.json(products);
})

app.post('/add', (req, res) => {
    const data = req.body;
    products.push(data);
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
    res.status(201).json(data);
});

app.use((req, res,next) => {
    res.status(404);
    res.sendFile("NotFound.html", { root: __dirname + "/static" });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});