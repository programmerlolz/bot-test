const {Composer} = require("telegraf");
const setPage = require("../commands/pagination/setPage");
const paginate = require("../commands/pagination/paginate");
const deleteAll = require("../commands/pagination/deleteAll");
const paginator = new Composer();

paginator.use((ctx, next) => {
    if(!ctx.session) return next();
    if(!ctx.session.pagination) ctx.session.pagination = {
        values: [],
        currentPage: 1
    };
    next();
})

paginator.action(/set_page_(.+)/, setPage);

paginator.action(/view_pages/, paginate);

paginator.action("page_delete_all", deleteAll);

module.exports = paginator;
