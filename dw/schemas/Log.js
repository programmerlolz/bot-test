const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    userId: mongoose.Types.Decimal128,
    adCode: String,
    token: String,
    admin: {
        type: Boolean,
        default: false
    },
    get: {
        type: Boolean,
        default: false
    }
})

module.exports = logSchema;