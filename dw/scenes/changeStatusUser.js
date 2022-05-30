const { Scenes, Markup } = require("telegraf");
const admin = require("../commands/admin");
const { User } = require("../database");

const stage = new Scenes.WizardScene(
    "change_status_user",
    async (ctx) => {
        ctx.wizard.state.user = await User.findOne({ id: ctx.match[1] });
        if(!ctx.wizard.state.user){
            ctx.reply("❌ Пользователь не найден!");
            return ctx.scene.leave();
        }
        ctx.editOrReply("🗒 Выберите новый статус", {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("Воркер 👷‍♂️", "status_0")],
                [Markup.button.callback("Администратор 👑", "status_1")],
                [Markup.button.callback("Саппорт 🆘", "status_2")],
                [Markup.button.callback("🛑 Отменить", "cancel")]
            ]).reply_markup
        });
        ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery?.data) return ctx.reply("🗒 Выберите новый статус");
        let newStatus = ctx.callbackQuery.data.slice("status_".length);
        if(isNaN(ctx.callbackQuery.data.slice("status_".length))) return ctx.reply("🗒 Выберите новый статус");
        newStatus = parseInt(newStatus);
        ctx.scene.leave();
        ctx.wizard.state.user.status = newStatus;
        await ctx.wizard.state.user.save();
        ctx.state.notEdit = true;
        ctx.reply("💾 Сохранено!").then(e => admin(ctx)).catch(e => admin(ctx));
    }
);

module.exports = stage;