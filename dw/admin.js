const { Composer } = require("telegraf");
const updateRequest = require("./actions/updateRequest");
const admin = require("./commands/admin");
const adminChange = require("./actions/adminChange");
const users = require("./commands/users");
const viewUser = require("./commands/viewUser");
const banUser = require("./commands/banUser");
const unbanUser = require("./commands/unbanUser");
const deleteUserGifts = require("./commands/deleteUserGifts");

const bot = new Composer(
    async (ctx, next) => {
        if(!ctx.state?.user) return next();
        if([1,2].includes(ctx.state.user.status)) next();
    }
);

bot.action("admin", admin);
bot.command("admin", admin);

bot.action("users", users);
bot.command("users", users);

bot.action(/view_user_(.+)/, viewUser);
bot.command("user", viewUser);

bot.action(/^ban_user_(.+)/, banUser);
bot.action(/^unban_user_(.+)/, unbanUser);

bot.action(/request_.+?_(.+)/, updateRequest);

bot.use((ctx, next) => {
    if(ctx.state.user.status == 1) next();
})

bot.action(/admin_change_(.+)/, adminChange);

bot.action("alert", (ctx) => ctx.scene.enter("alert"));
bot.command("alert", (ctx) => ctx.scene.enter("alert"));

bot.action(/^change_status_user_(.+)/, (ctx) => ctx.scene.enter("change_status_user"));
bot.action(/^delete_ads_user_(.+)/, deleteUserGifts);

module.exports = bot;
