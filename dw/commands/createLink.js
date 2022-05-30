const { Markup } = require("telegraf");
const generateCode = require("../utils/generateCode");
const {Ad} = require("../database");
const menu = require("../commands/menu");

const time = {1: "1 месяц", 3: "3 месяца", 12: "1 год"};

module.exports = async (ctx) => {
    if(!ctx.match || !ctx.match[1]){
        ctx.editOrReply("🕓 Выберите срок действия гифта", {
            reply_markup: Markup.inlineKeyboard([
               [
                   Markup.button.callback("⏳ 1 месяц", "create_link_1"),
                   Markup.button.callback("⏳ 3 месяца", "create_link_3"),
                   Markup.button.callback("⏳ 1 год", "create_link_12")
               ]
            ]).reply_markup
        });
        return;
    }

    let code = generateCode(13);
    let ad = await Ad.create({
        code,
        expires: ctx.match[1],
        userId: ctx.from.id
    }).catch(e => {});
    if(!ad) return ctx.editOrReply("❌ Ошибка!");
    ctx.editOrReply(`✅ <b>Гифт сгенерирован!</b>

🕓 Срок: <b>${time[ad.expires]}</b>
🔗 Ссылка: <code>${ctx.state.domain}${code}</code>`,
        {
            parse_mode: "html"
        });
    ctx.state.notEdit = true;
    menu(ctx);
}
