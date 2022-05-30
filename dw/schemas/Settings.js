const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: Number,
    adminGroupId: mongoose.Types.Decimal128,
    logsGroupId: mongoose.Types.Decimal128,
    projectName: String,
    topicStarter: String,
    support: String,
    payments: Number,
    rules: String,
    chatLink: String,
    infoLink: String,
    logsLink: String,
    domain: String
}, {
    timestamps: { createdAt: true }
})

module.exports = userSchema;