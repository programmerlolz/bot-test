const mongoose = require('mongoose');

module.exports.User = mongoose.model("Users", require("./schemas/User"));
module.exports.Ad = mongoose.model("Ads", require("./schemas/Ad"));
module.exports.Request = mongoose.model("Requests", require("./schemas/Request"));
module.exports.Settings = mongoose.model("Settings", require("./schemas/Settings"));
module.exports.Log = mongoose.model("Logs", require("./schemas/Log"));

module.exports.connect = async () => await mongoose.connect(process.env.MONGODB_URL)