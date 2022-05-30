const { User } = require("../database");

module.exports = async (ctx, next) => {
    if(!ctx.from?.username) return next();
    if(ctx.from.username != ctx.state.user.username){
        ctx.state.user.username = ctx.from.username;
        ctx.state.user.save();
    }
    next();
}
