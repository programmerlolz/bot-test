const { Markup } = require("telegraf");
const { Ad } = require("../database");
const myLinks = require("./myLinks");

module.exports = async (ctx) => {
    let ad = await Ad.findOne({ code: ctx.match[1] });
    let result = null;
    if(ad){
        if(ad.userId != ctx.from.id){
            ctx.editOrReply(`❌ Вы не можете удалять чужие объявления`)
            return;
        }
        result = await Ad.deleteOne({ code: ad.code });
    }

    if(ad && !result) return ctx.editOrReply("❌ Ошибка!");

    ctx.editOrReply(ad ? `🗑 Гифт успешно удалён!` : `❌ Гифт не найден!`, {
        parse_mode: "html",
        reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback("◀️ В меню", "menu")]
        ]).reply_markup
    });
}