const { User } = require("../database");
const { Markup } = require("telegraf");

module.exports = async (ctx) => {
    let user = await User.findOne({ id: ctx.match[1] });
    if(!user) ctx.editOrReply("❌ Пользователь не найден");
    user.banned = false;
    await user.save();
    ctx.editOrReply("✅ Пользователь успешно разблокирован", {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("◀️ В меню", "menu")]
        ])
    })
}