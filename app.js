require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());

const Leaderboard = require("./models/leaderboard")
const Message = require("./models/message");
const leaderboard = require("./models/leaderboard");

port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

mongoose.connect(process.env.DB_CLOUD_URL).then(() => {
  console.log("DB connection established");
});
app.get('/', (req, res) => {
  res.send("Match-Making-Game")
})

app.get('/api/leaderboard', async (req, res) => {
  try {
    const data = await Leaderboard.find();
    leaderboardData = data.map((x) => ({
      Rank: 0, 
      Player: x.Player,
      Score: parseInt(x.Score, 10),
    }));

    leaderboardData.sort((a, b) => b.Score - a.Score);
    leaderboardData.forEach((player, index) => {
      player.Rank = index + 1;
    });

    const topFive = leaderboardData.slice(0, 5);
    res.status(200).json(topFive);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/leaderboard', async (req, res) => {
    try {
      const { player, score } = req.body; 

      if (!player || !score) {
        return res.status(400).json({ error: 'Missing required fields: player, or score' });
      }
  
      const newEntry = new Leaderboard({ Player: player, Score: score });
      await newEntry.save();
  
      res.status(201).json({ message: 'Leaderboard entry added successfully' });
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
      const messages = await Message.find(); // Retrieve all messages
      const messageContents = messages.map((message) => message.message);
      res.status(200).json(messageContents);

    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { message } = req.body;
        console.log(req.body)

        if (!message) {
            return res.status(400).json({ error: 'Missing required fields: message' });
        }
    
        const newMessage = new Message({ message });
        await newMessage.save();
        res.status(201).json({ message: 'Message added successfully' });

    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ message: 'All messages deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});