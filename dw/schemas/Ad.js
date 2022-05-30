const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    userId: mongoose.Types.Decimal128,
    code: String,
    expires: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    },
    logs: {
        type: Number,
        default: 0
    }
})

module.exports = adSchema;