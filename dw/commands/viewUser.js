const { Markup } = require("telegraf");
const { User, Ad, Log, Request } = require("../database");
const myLinks = require("./myLinks");

const statuses = {0: "Воркер 👷‍♂️", 1: "Администратор 👑", 2: "Саппорт 🆘"};
let requestStatuses = {0: "⏳ Ожидает принятия", 1: "❌ Заявка отклонена"};

module.exports = async (ctx) => {
    let userId = null;
    if(ctx.match) userId = ctx.match[1];
    else {
        if(!ctx.message?.text) return ctx.reply("❌ Укажите пользователя");
        userId = ctx.message.text.slice('/user'.length).trim();
        if(userId.length == 0) return ctx.reply("❌ Укажите пользователя");
    }
    let user = await User.findOne({ $or: [
            ...(isNaN(userId)
            ? []
            : [{ id: userId}]),
            { username: userId },
            { username: userId.replace("@", "") }
        ] });
    if(!user) return ctx.editOrReply("❌ Пользователь не найден!");
    let logs = await Log.count({ userId: user.id }) || 0;
    let ads = await Ad.count({ userId: user.id }) || 0;
    let request = await Request.findOne({ userId: user.id });
    let statusButtons = [[Markup.button.callback("🔄 Изменить статус", "change_status_user_"+user.id)]];
    if(request){
        let temp = [];
        temp.push(Markup.button.callback("✅ Принять", "request_accept_" + user.id));
        if(request.status === 0){
            temp.push(Markup.button.callback("❌ Отклонить", "request_decline_" + user.id));
        }
        statusButtons = [temp];
    }
    let textStatus = (request ? requestStatuses[request.status] : statuses[user.status]) || user.status;
    if(!request && user.status == 10){
        statusButtons = [];
        textStatus = '⏳ Собирается отправить заявку';
    }
    let text = `👤 Пользователь @${user.username}

🎁 Гифтов: <code>${ads}</code>
🔫 Логов: <code>${logs}</code>
😎 Статус: ${textStatus}`;
    ctx.editOrReply(text, {
        parse_mode: "html",
        reply_markup: Markup.inlineKeyboard([
            (user.banned == true
                ? [Markup.button.callback("🔓 Разблокировать", "unban_user_"+user.id)]
                : [Markup.button.callback("🔒 Заблокировать", "ban_user_"+user.id)]),
            ...statusButtons,
            [Markup.button.callback("❌ Удалить гифты", "delete_ads_user_"+user.id)],
            [Markup.button.callback("◀️ В меню", "menu")]
        ]).reply_markup
    })
}