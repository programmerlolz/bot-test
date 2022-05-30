module.exports.run = () => {
    process.on("unhandledRejection", (e) => console.log(e));
}