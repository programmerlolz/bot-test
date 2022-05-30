const { Markup } = require("telegraf");
const { Ad } = require("../../database");
const paginate = require("./paginate");

module.exports = async (ctx) => {
    if(!ctx.session.pagination.deletable.status) return;
    if(!ctx.session.pagination.deletable.function) return;
    let result = null;
    try{
        result = await ctx.session.pagination.deletable.function();
        if(!result) ctx.editOrReply("❌ Ошибка").catch(() => {});
        else {
            ctx.editOrReply(`🗑 Удалено ${result.deletedCount} ${ctx.session.pagination.deletable.afterDelete}`, {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback("◀️ В меню", "menu")]
                ]).reply_markup
            })
        }
    }catch(err){
        ctx.editOrReply("❌ Ошибка").catch(() => {});
    }

}