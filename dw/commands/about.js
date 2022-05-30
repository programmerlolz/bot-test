const { Markup } = require("telegraf");
const { Log } = require("../database");

module.exports = async (ctx) => {
    let date = ctx.state.settings.createdAt;
    let count = await Log.count({});

    date = date.getUTCDate().toString().padStart(2, "0")+"."+(date.getUTCMonth()+1).toString().padStart(2, "0")+"."+date.getUTCFullYear();
    ctx.reply(`ℹ️ Информация о проекте <b>${ctx.state.settings.projectName}</b>

🕔 Мы открылись: ${date}
✏️ Число логов: <code>${count}</code>

😍 ТС: ${ctx.state.settings.topicStarter}
😻 Саппорт: ${ctx.state.settings.support}
🔗 Домен: <code>${ctx.state.settings.domain}</code>

💸 Выплаты:
Каждый <code>${ctx.state.settings.payments}</code>-й токен админу
`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("🛑 Правила", "rules")],
            [
                Markup.button.url("💸 Отстук", ctx.state.settings.logsLink),
                Markup.button.url("⚙️ Инфо", ctx.state.settings.infoLink)
            ],
            [Markup.button.url("⌨️ Чат", ctx.state.settings.chatLink)]
        ]).reply_markup
    })
}
