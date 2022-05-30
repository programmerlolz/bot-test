const { Markup } = require("telegraf");
const { Request } = require("../database");

module.exports = async (ctx, next) => {
    if(!ctx.from?.id) return next();
    if(ctx.chat.type != 'private') return next();
    if(ctx.state.user.status == 10){
        let request = await Request.findOne({ userId: ctx.from.id });
        if(!!request && request.status == 1)  return ctx.reply("❌ Ваша заявка была отклонена");
        if(!!request) return ctx.reply("✅ Вы уже подали заявку, ожидайте её рассмотрения.")
        if(ctx?.message?.text == '👽 Подать заявку') return ctx.scene.enter("send_request");
        ctx.reply("⚠️ Вас нет в списке пользователей.\nХотите подать заявку?", {
            reply_markup: Markup.keyboard([
                Markup.button.text("👽 Подать заявку")
            ]).resize().reply_markup
        })
        return;
    }else if(ctx.state.user.status == 11){
        return ctx.reply("❌ Вы заблокированы!").catch(e => {});
    }else next();
}
