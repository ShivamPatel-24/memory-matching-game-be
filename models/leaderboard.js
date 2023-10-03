const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    Rank: {
        type: String,
        required: true,
    },
    Player: {
        type: String,
        required: true
    },
    Score: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);


/* To create an entry in DB
 
 const leaderboard = await Leaderboard.create({
    rank,
    Player: email.toLowerCase(),
    Score
});

 */