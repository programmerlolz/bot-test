const { Markup } = require("telegraf");
let length = 15;
let row = 3;

module.exports = (values) => {
    let result = [];
    for(let i = 0; i < values.length / length; i++){
        let page = [];
        for(let j = 0; j < length / row; j++){
            let tempRow = [];
            for(let k = 0; k < row; k++){
                let value = values[ (i * length) + (j * row) + k ];
                if(value) tempRow.push(Markup.button.callback(value[0] || "Неизвестно", value[1]));
            }
            if(tempRow.length > 0) page.push(tempRow);
        }
        if(page.length > 0) result.push(page);
    }
    return result;
}
