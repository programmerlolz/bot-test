const { Markup } = require("telegraf");
const { User } = require("../database");
const paginate = require("./pagination/paginate");

module.exports = async (ctx) => {
    let Users = await User.find();
    ctx.session.pagination = {
        values: Users.map(user => [user.username, "view_user_"+user.id]),
        currentPage: 1,
        title: "👤 Список пользователей",
        deletable: {
            status: false
        }
    };
    paginate(ctx);
}