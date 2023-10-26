const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Message", messageSchema);
