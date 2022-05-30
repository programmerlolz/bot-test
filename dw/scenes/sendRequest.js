const { Scenes, Markup } = require("telegraf");
const { Request } = require("../database");

let cancel = Markup.inlineKeyboard([Markup.button.callback("🛑 Отменить", "cancel")]).reply_markup;

const stage = new Scenes.WizardScene(
    "send_request",
    async (ctx) => {
        if(ctx.state.user.status != 10){
            ctx.reply("❌ Вы уже зарегистрированы в боте!");
            return ctx.scene.leave();
        }else{
            ctx.reply("🖥 Отправьте ссылку на ваш профиль на форуме Lolz", {
                reply_markup: cancel
            });
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if(!ctx.message?.text) return ctx.reply("❌ Укажите верную ссылку");
        let link = ctx.message.text;
        if(!/lolz.guru\/.+?/g.test(link)) return ctx.reply("❌ Укажите верную ссылку");
        ctx.wizard.state.request = {
            lolz: link
        };
        ctx.reply("ℹ️ Укажите свой опыт работы", {
            reply_markup: cancel
        });
        return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.message?.text) return ctx.reply("❌ Укажите свой опыт");
        ctx.wizard.state.request.experience = ctx.message.text;
        ctx.wizard.next();
        ctx.reply("🕔 Укажите время которое вы готовы уделять", {
            reply_markup: cancel
        });
    },
    async (ctx) => {
        if(!ctx.message?.text) return ctx.reply("❌ Укажите время которое вы готовы уделять");
        ctx.wizard.state.request.time = ctx.message.text;
        ctx.scene.leave();
        if(ctx.state.user.status != 10) return ctx.reply("❌ Вы уже зарегистрированы в боте");
        let request = new Request({
            ...ctx.wizard.state.request,
            userId: ctx.from.id,
            status: 0
        });
        let result = await request.save().catch(e => {});
        if(!result) ctx.reply("❌ Ошибка");
        else {
            ctx.reply("✅ Ваша заявка успешно отправлена!");
            ctx.telegram.sendMessage(ctx.state.settings.adminGroupId.toString(), `⚠️ Новая завка!
👨 Пользователь: <a href="tg://user?id=${ctx.from.id}">${ctx.from.username}</a>
🖥 Ссылка на форуме: <a href="${ctx.wizard.state.request.lolz}">ТЫК</a>
ℹ️ Опыт работы: <code>${ctx.wizard.state.request.experience}</code>
🕔 Время: <code>${ctx.wizard.state.request.time}</code>
            `, {
                parse_mode: "HTML",
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.button.callback("✅ Принять", "request_accept_" + ctx.from.id),
                        Markup.button.callback("❌ Отклонить", "request_decline_" + ctx.from.id)
                    ]
                ]).reply_markup
            });
        }
    }
);

module.exports = stage;
