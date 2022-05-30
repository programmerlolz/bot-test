module.exports = class Cancellation {
    constructor() {
        this.cancel = false;
    }
    setCancel(bool = true){
        this.cancel = bool;
    }
}