const { Markup } = require("telegraf");

module.exports = async (ctx) => {
    ctx.state.change = {
        toChange: ctx.match[1]
    }
    ctx.scene.enter("admin_change");
}