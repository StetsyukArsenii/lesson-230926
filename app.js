const express = require('express');
const app = express();

app.use(express.static('static'));
app.use(express.json());

let producsts = []

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.sendFile("inedex.html", { root: __dirname });

});

app.post("/ads" , (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.json(products).end();
})

app.post("/add", (req, res) => {
    let data = req.body;
    products.push(data);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.redirect("/ads");
})

app.use((req, res,next) => {
    res.status(404);
    res.sendFile("404.html", { root: "static" });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});