const { Settings } = require("../database");

module.exports = async (ctx, next) => {
    let settings = await Settings.findOne({ id: 1 });
    ctx.state.settings = settings;
    next();
}