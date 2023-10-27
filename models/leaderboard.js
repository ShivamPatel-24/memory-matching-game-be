const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({

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
    Player: email.toLowerCase(),
    Score
});

 */