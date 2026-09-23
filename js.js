const express = reqire("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use((req, res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express.static("public"));


app.get("/api/users", (req,res) => {
  res.json([{ name: "John Doe" }, { name: "Jane Doe" }]);

});

app.use((err,req,res,next) => {
  console.log(err.stack);
  re.status(500).send("Something broke!");
})