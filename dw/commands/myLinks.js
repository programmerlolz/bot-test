const { Markup } = require("telegraf");
const { Ad } = require("../database");
const paginate = require("./pagination/paginate");

module.exports = async (ctx) => {
    let Ads = await Ad.find({ userId: ctx.from.id });
    ctx.session.pagination = {
        values: Ads.map(ad => [ad.code, "view_ad_"+ad.code]),
        currentPage: 1,
        title: "📦 Список ваших гифтов",
        deletable: {
            status: true,
            title: "гифты",
            afterDelete: "гифтов",
            function: () => Ad.deleteMany({ userId: ctx.from.id })
        }
    };
    paginate(ctx);
}