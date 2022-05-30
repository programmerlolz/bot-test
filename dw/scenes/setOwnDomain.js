const { Scenes, Markup } = require("telegraf");
const profile = require("../commands/profile");
const { Settings } = require("../database");

const stage = new Scenes.WizardScene(
    "set_own_domain",
    async (ctx) => {
        ctx.reply("⌨️ Введите новый домен", {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("❌ Убрать домен", "remove_own_domain")],
                [Markup.button.callback("🛑 Отменить", "cancel")]
            ]).reply_markup
        });
        ctx.wizard.next();
    },
    async (ctx) => {
        let newValue = null;
        if(ctx.callbackQuery?.data != 'remove_own_domain'){
            if(!ctx.message?.text) return ctx.reply("⌨️ Введите новый домен");
            newValue = ctx.message.text;
            if(!newValue.endsWith("/")) newValue += "/";
            if(!/https:\/\/(.+?)\//.test(newValue)){
                return ctx.reply("❌ Укажите валидную HTTPS ссылку");
            }
        }
        ctx.scene.leave();
        ctx.state.user.customDomain = newValue;
        ctx.state.user.save();
        ctx.reply("💾 Сохранено!").then(e => profile(ctx)).catch(e => profile(ctx));
    }
);

module.exports = stage;