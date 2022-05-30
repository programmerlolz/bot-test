const { Markup } = require("telegraf");
const { Ad } = require("../../database");
const splitPages = require("../../utils/splitPages");
const paginate = require("./paginate");

module.exports = async (ctx) => {
    if(isNaN(ctx.match[1])) return;
    if(!ctx.session.pagination.values) return;
    let pages = splitPages(ctx.session.pagination.values);
    let page = parseInt(ctx.match[1]);
    if(page > pages.length || page < 1) return;
    ctx.session.pagination.currentPage = page;
    paginate(ctx);
}