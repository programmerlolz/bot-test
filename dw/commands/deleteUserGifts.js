const { Markup } = require("telegraf");
const { User, Ad } = require("../database");
const myLinks = require("./myLinks");

module.exports = async (ctx) => {
    let user = await User.findOne({ id: ctx.match[1] });
    if(!user) return ctx.editOrReply("❌ Пользователь не найден!");

    await Ad.deleteMany({ userId: user.id });

    ctx.editOrReply(`🗑 Гифты успешно удалёны!`);
}