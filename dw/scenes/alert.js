const { Scenes, Markup } = require("telegraf");
const admin = require("../commands/admin");
const { User } = require("../database");

let cancel = Markup.inlineKeyboard([Markup.button.callback("🛑 Отменить", "cancel")]).reply_markup;

const stage = new Scenes.WizardScene(
    "alert",
    async (ctx) => {
        ctx.reply("⌨️ Введите текст сообщения для рассылки", {
            reply_markup: cancel
        });
        ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.message?.text) return ctx.reply("⌨️ Введите текст сообщения для рассылки");
        ctx.scene.leave();
        ctx.reply("⏳ Отправляем сообщения");
        let results = [];
        let users = await User.find();
        users.forEach(user =>
            results.push(
                new Promise((res, rej) =>
                    ctx.telegram.sendMessage(user.id.toString(), ctx.message.text)
                        .then(() => res(1))
                        .catch(() => res(0))
                )
            )
        )

        results = await Promise.all(results);
        ctx.reply(`📢 Рассылка отправлена!
👤 Всего пользователей: <code>${users.length}</code>

✅ Успешно: <code>${results.filter(e => e === 1).length}</code>
❌ Ошибка: <code>${results.filter(e => e === 0).length}</code>`, {
            parse_mode: "html"
        });
    }
);

module.exports = stage;