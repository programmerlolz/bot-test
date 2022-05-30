const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    id: mongoose.Types.Decimal128,
    status: Number,
    customDomain: String,
    banned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: {
        createdAt: true
    }
})

module.exports = userSchema;