const { User } = require("../database");

module.exports = async (ctx, next) => {
    if(!ctx.from?.id) return next();
    ctx.state.domain = ctx.state.user.customDomain || ctx.state.settings.domain;
    next();
}
