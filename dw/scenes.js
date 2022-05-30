const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require("./scenes/sendRequest"),
    require("./scenes/adminChange"),
    require("./scenes/alert"),
    require("./scenes/setOwnDomain"),
    require("./scenes/changeStatusUser")
]);

stage.action("cancel", (ctx) => {
    ctx.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id).catch(e => {});
    ctx.scene.leave();
});

module.exports = stage;