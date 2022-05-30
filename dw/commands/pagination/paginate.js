const { Markup } = require("telegraf");
const { Ad } = require("../../database");
const splitPages = require("../../utils/splitPages");

module.exports = async (ctx) => {
    let values = [];
    if(ctx.session.pagination.values.length == 0) values = Markup.button.callback("Страница пуста", "none");
    else values = splitPages(ctx.session.pagination.values);
    ctx.editOrReply(`${ctx.session.pagination.title} (Всего: ${ctx.session.pagination.values.length})`, {
        reply_markup: Markup.inlineKeyboard([
                ...(Array.isArray(values)
                ? values[ctx.session.pagination.currentPage-1]
                : [[values]]),
            [
                Markup.button.callback("◀️", "set_page_"+(ctx.session.pagination.currentPage-1)),
                Markup.button.callback(
                    ctx.session.pagination.currentPage+"/"+(values.length || 1),
                    "none"
                ),
                Markup.button.callback("▶️", "set_page_"+(ctx.session.pagination.currentPage+1))
            ],
            ctx.session.pagination.deletable.status
                ? [Markup.button.callback("❌ Удалить все " + ctx.session.pagination.deletable.title, "page_delete_all")]
                : [],
            [Markup.button.callback("◀️ В меню", "menu")]
        ]).reply_markup
    })
}