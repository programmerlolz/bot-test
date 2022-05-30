const { User } = require("../database");

module.exports = async (ctx, next) => {
    if(!ctx.from?.id) return next();
    let user = await User.findOne({ id: ctx.from.id });
    if(!user) user = await User.create({ username: ctx.from.username, id: ctx.from.id, status: 10 });
    ctx.state.user = user;
    if(ctx.state.user.banned) return ctx.reply("❌ Вы заблокированы!").catch(e => {});
    next();
}
