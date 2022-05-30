require("dotenv").config();
const database = require("./database");
const bot = require("./bot");
const server = require("./server/server");
(async() => {
    await database.connect().catch(e => e => console.log(e));
    console.log("[DATABASE] Connected!");
    await bot.start().catch(e => console.error(e));
    console.log("[BOT] Started!");
    await server.start().catch(e => console.error(e));
    console.log("[SERVER] Listen!");
})();