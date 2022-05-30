let symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

module.exports = (length) => {
    let result = "";
    for(let i = 0; i < length; i++){
        result += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return result;
}