require("./utils/unhandledRejection").run();
require("./utils/editOrReply");
const { Telegraf, session } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const scenes = require("./scenes");
const admin = require("./admin");
const loadUser = require("./middlewares/loadUser");
const userDomain = require("./middlewares/userDomain");
const updateUsername = require("./middlewares/updateUsername");
const loadSettings = require("./middlewares/loadSettings");
const hasRequest = require("./middlewares/hasRequest");
const pagination = require("./middlewares/pagination");
const menu = require("./commands/menu");
const profile = require("./commands/profile");
const about = require("./commands/about");
const rules = require("./commands/rules");
const createLink = require("./commands/createLink");
const myLinks = require("./commands/myLinks");
const viewAd = require("./commands/viewAd");
const deleteAd = require("./commands/deleteAd");
const getTokens = require("./actions/getTokens");

bot.use(loadUser);
bot.use(updateUsername);
bot.use(loadSettings);
bot.use(userDomain);
bot.use(session());
bot.use(scenes);
bot.use(hasRequest);
bot.use(pagination);

bot.start(menu);
bot.action("menu", menu);
bot.command("menu", menu);
bot.hears("⚙️ Меню", menu);

bot.action("profile", profile);
bot.command("profile", profile);
bot.hears("💼 Профиль", profile);

bot.action("about", about);
bot.command("about", about);
bot.hears("✉️ О проекте", about);

bot.action("rules", rules);
bot.command("rules", rules);

bot.action("create_link", createLink);
bot.command("create_link", createLink);
bot.action(/create_link_(.+)/, createLink);

bot.action("my_links", myLinks);
bot.command("my_links", myLinks);

bot.action(/view_ad_(.+)/, viewAd);
bot.action(/delete_ad_(.+)/, deleteAd);
bot.action("get_tokens", getTokens);

bot.action("set_own_domain", (ctx) => ctx.scene.enter("set_own_domain"));
bot.command("set_own_domain", (ctx) => ctx.scene.enter("set_own_domain"));

bot.use(admin);
module.exports.start = async () => await bot.launch();
module.exports.bot = bot;