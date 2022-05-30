const { Request, User } = require("../database");
const { Markup } = require("telegraf");

module.exports = async (ctx) => {
    let newStatus = 1;
    if(ctx.callbackQuery.data.includes("accept")) newStatus = 2;
    let userId = ctx.match[1];
    if(newStatus == 1){
        ctx.telegram.sendMessage(userId, `❌ Ваша заявка была отклонена`, {
            reply_markup: { remove_keyboard: true }
        });
        await Request.updateOne({ userId: userId }, { status: 1 });
        ctx.answerCbQuery("✅ Успешно");
    }else{
        ctx.telegram.sendMessage(userId, `✅ Ваша заявка была принята`, {
            reply_markup: Markup.keyboard([
                [Markup.button.text("⚙️ Меню")],
                [
                    Markup.button.text("💼 Профиль"),
                    Markup.button.text("✉️ О проекте")
                ]
            ]).resize().oneTime(false).reply_markup
        });
        await Request.deleteOne({ userId: userId });
        await User.updateOne({ id: userId }, { status: 0 });
    }
    ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                    [Markup.button.callback((newStatus == 1 ? "❌ Отклонено" : "✅ Принято"), "none")]
    ]).reply_markup).catch(e => {});
}
