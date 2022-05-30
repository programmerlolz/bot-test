const { Markup } = require("telegraf");

module.exports = async (ctx) => {
    ctx.editOrReply(`👽 Название проекта: <b>${ctx.state.settings.projectName}</b>
   
🆔 ID Группы админов: <code>${ctx.state.settings.adminGroupId}</code>
🆔 ID Канала отстуков <code>${ctx.state.settings.logsGroupId}</code>
😍 ТС: ${ctx.state.settings.topicStarter} 
😻 Саппорт: ${ctx.state.settings.support}
💸 Выплаты: <code>Каждый ${ctx.state.settings.payments}-й токен админу</code>

ℹ️ Ссылка на инфо: <code>${ctx.state.settings.infoLink}</code>
💸 Ссылка на отстук: <code>${ctx.state.settings.logsLink}</code>
⌨️ Ссылка на чат: <code>${ctx.state.settings.chatLink}</code>
🔗 Домен: <code>${ctx.state.settings.domain}</code>
`, {
        parse_mode: "html",
        reply_markup: Markup.inlineKeyboard([
            [
                Markup.button.callback("🆔 Админ", "admin_change_adminGroupId"),
                Markup.button.callback("🆔 Отстук", "admin_change_logsGroupId")
            ],
            [
                Markup.button.callback("😍 ТС", "admin_change_topicStarter"),
                Markup.button.callback("😻 Саппорт", "admin_change_support")
            ],
            [
                Markup.button.callback("ℹ️ Ссылка инфо", "admin_change_infoLink"),
                Markup.button.callback("💸 Ссылка отстук", "admin_change_logsLink")
            ],
            [
                Markup.button.callback("⌨️ Ссылка чат", "admin_change_chatLink"),
                Markup.button.callback("🔗 Домен", "admin_change_domain")
            ],
            [
                Markup.button.callback("💸 Выплаты", "admin_change_payments"),
                Markup.button.callback("🛑 Текст правил", "admin_change_rules")
            ],
            [
                Markup.button.callback("👽 Название проекта", "admin_change_projectName"),
                Markup.button.callback("📢 Рассылка", "alert")
            ],
            [
                Markup.button.callback("👤 Управление пользователями", "users")
            ]
        ]).reply_markup
    })
}