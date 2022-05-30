const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: mongoose.Types.Decimal128,
    lolz: String,
    experience: String,
    time: String,
    status: Number,
})

module.exports = userSchema;