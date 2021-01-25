const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userTag: String,
    userId: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    cash: {
        type: Number,
        default: 0
    },
    xpNeeded: {
        type: Number,
        default: 30,
    },
    totalXp: {
        type: Number,
        default: 0
    },
    inventory: [{
        name: String,
        value: Number
    }]
});

module.exports = mongoose.model("User", userSchema);