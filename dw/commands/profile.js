const { Log } = require("../database");
const { Markup } = require("telegraf");
const statuses = {0: "Воркер 👷‍♂️", 1: "Администратор 👑", 2: "Саппорт 🆘"};

module.exports = async (ctx) => {
    let admin = false;
    if(ctx.from.username == ctx.state.settings.topicStarter.slice(1)) admin = true;
    let countNotGet = await Log.count({
        userId: ctx.from.id,
        get: false,
        admin: false
    });
    if(admin){
        countNotGet += await Log.count({
           get: false,
           admin: true
        });
    }
    let count = await Log.count({ userId: ctx.from.id });
    ctx.reply(`👤 Твой профиль

🆔 Твой ID: <code>${ctx.from.id}</code>
🔫 Логов: <code>${count}</code>
💎 Статус: ${statuses[ctx.state.user.status]}
${ctx.state.user.customDomain ? "🔗 Личный домен: <code>" + ctx.state.user.customDomain + "</code>\n" : ""}
🕓 В команде: ${getTime(ctx.state.user.createdAt)}`, {
        parse_mode: "html",
        reply_markup: Markup.inlineKeyboard([
            (ctx.state.user.status == 1)
                ? [Markup.button.callback("🖥 Админ панель", "admin")]
                : [],
            [Markup.button.callback("🔗 Личный домен", "set_own_domain")],
            [Markup.button.callback("💳 Получить токены (" + countNotGet + ")", "get_tokens")]
            ]).reply_markup
    })
}

function getTime(oldTimestamp){
    let time = new Date(new Date() - oldTimestamp);
    let years = time.getUTCFullYear() - 1970;
    if(years) return `${years} ${declOfNum(years, ["год", "года", "лет"])}`;
    let months = time.getUTCMonth();
    if(months) return `${months} ${declOfNum(months, ["месяц", "месяца", "месяцев"])}`;
    let days = time.getUTCDate() - 1;
    if(days) return `${days} ${declOfNum(days, ["день", "дня", "дней"])}`;
    let hours = time.getUTCHours();
    if(hours) return `${hours} ${declOfNum(hours, ["час", "часа", "часов"])}`;
    let minutes = time.getUTCMinutes();
    if(minutes) return `${minutes} ${declOfNum(minutes, ["минута", "минуты", "минут"])}`;
    let seconds = time.getUTCSeconds();
    if(seconds) return `${seconds} ${declOfNum(seconds, ["секунда", "секунды", "секунд"])}`;
}
function declOfNum(n, text_forms) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}