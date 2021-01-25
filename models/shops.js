const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    description: String,
    cost: Number,
    role: String,
    inventory: {
        type: Number,
        default: -1
    }
});

module.exports = mongoose.model("Shop", userSchema);