const { Log } = require("../database");
const { Markup } = require("telegraf");
const statuses = {0: "Воркер 👷‍♂️", 1: "Администратор 👑"};

module.exports = async (ctx) => {
    ctx.editOrReply(ctx.state.settings.rules, {parse_mode: "html"})
}