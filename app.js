require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

mongoose.connect(process.env.DB_LOCAL_URL).then(() => {
    console.log("DB connection established");
});

app.get('/', (req, res) => {
    res.send("Match Making Game")
})

app.get('/leaderboard', (req, res) => {
    res.render("leaderboard")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});