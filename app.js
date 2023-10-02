require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

port = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.DB_LOCAL_URL).then(() => {
    console.log("DB connection established");
});

app.get('/', (req, res) => {
    res.send("Memory matching game")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});