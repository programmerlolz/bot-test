const { Markup } = require("telegraf");

module.exports = async (ctx) => {
    if(ctx.message?.text?.startsWith("/menu") || ctx.message?.text?.startsWith("/start")){
        await ctx.reply("🔄 Обновление клавиатуры", {
            reply_markup: Markup.keyboard([
                [Markup.button.text("⚙️ Меню")],
                [
                    Markup.button.text("💼 Профиль"),
                    Markup.button.text("✉️ О проекте")
                ]
            ]).resize().oneTime(false).reply_markup
        }).catch(e => {});
    }
    ctx.editOrReply(`🗒 Ты попал в главное меню`,
        {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("🔗 Создать ссылку", "create_link")],
                [Markup.button.callback("💼 Мои ссылки", "my_links")]
            ]).reply_markup
        });
}