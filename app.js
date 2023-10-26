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
const Message = require("./models/message")

port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

mongoose.connect(process.env.DB_LOCAL_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB connection established");
});

/*
app.get('/chatroom', (req, res) => {
    res.render('chatroom', { messages: [] });
  });
  
  io.on('connection', (socket) => {
    socket.on('chat message', (message) => {
      io.emit('chat message', { user: 'Anonymous', message });
    });
  });
*/

app.get('/api/leaderboard', async (req, res) => {

    try {
        const leaderboardData = await Leaderboard.find().sort({ Score: -1 }).limit(5); // Assuming we want the top 5 scores
        res.status(200).json(leaderboardData);
        // res.render('leaderboard.ejs', { leaderboardData });
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/api/leaderboard', async (req, res) => {
    try {
      const { rank, player, score } = req.body; 

      if (!rank || !player || !score) {
        return res.status(400).json({ error: 'Missing required fields: rank, player, or score' });
      }
  
      const newEntry = new Leaderboard({ Rank: rank, Player: player, Score: score });
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