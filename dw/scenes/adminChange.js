const { Scenes, Markup } = require("telegraf");
const admin = require("../commands/admin");
const { Settings } = require("../database");

let cancel = Markup.inlineKeyboard([Markup.button.callback("🛑 Отменить", "cancel")]).reply_markup;

const stage = new Scenes.WizardScene(
    "admin_change",
    async (ctx) => {
        if(!ctx.state?.change?.toChange){
            ctx.reply("❌ Ошибка!");
            return ctx.scene.leave();
        }
        ctx.wizard.state.change = ctx.state.change;
        ctx.reply("⌨️ Введите новое значение", {
            reply_markup: cancel
        });
        ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.message?.text) return ctx.reply("⌨️ Введите новое значение");
        let newValue = ctx.message.text;
        if(ctx.wizard.state.change.toChange == "domain"){
            if(!newValue.endsWith("/")) newValue += "/";
            if(!/https:\/\/(.+?)\//.test(newValue)){
                return ctx.reply("❌ Укажите валидную HTTPS ссылку");
            }
        }
        if(ctx.wizard.state.change.toChange == "payments"){
            if(isNaN(newValue)) return ctx.reply("❌ Укажите который по счёту лог будет улетать админу (число)");
        }
        if(
            ctx.wizard.state.change.toChange == "topicStarter"
            || ctx.wizard.state.change.toChange == "support"
        ){
            if(!newValue.startsWith("@")) return ctx.reply("❌ Вы должны указать пинг, например @BotFather");
        }
        ctx.scene.leave();
        ctx.state.settings[ctx.wizard.state.change.toChange] = newValue;
        ctx.state.settings.save();
        ctx.reply("💾 Сохранено!").then(e => admin(ctx)).catch(e => admin(ctx));
    }
);

module.exports = stage;
