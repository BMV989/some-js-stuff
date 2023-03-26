const fs = require("fs");

function encode(string) {
    const ESC = "#";
    let output = "";
    function strict_enumerator() {
        let counter = 1;
        let answer = [];
        let previous_symbol = string[0];
        for (const symbol of string.substr(1)) {
            if (symbol === previous_symbol) {
                counter++;
                continue;
            }
            answer.push({ symbol: previous_symbol, counter: counter });
            counter = 1;
            previous_symbol = symbol;
        }
        answer.push({ symbol: previous_symbol, counter: counter });
        return answer;
    }
    strict_enumerator().forEach((element) => {
        if (element.symbol === ESC) {
            while (element.counter > 255) {
                output += ESC + String.fromCharCode(255) + ESC;
                element.counter -= 255;
            }
            output += ESC + String.fromCharCode(element.counter - 1) + ESC;
            return;
        }
        while (element.counter > 259) {
            output += ESC + String.fromCharCode(255) + element.symbol;
            element.counter -= 259;
        }
        if (element.counter < 4) {
            output += element.symbol.repeat(element.counter);
            return;
        }
        output += ESC + String.fromCharCode(element.counter - 4) + element.symbol;
        return;
    });
    return output;
}

function decode(string) {
    let output = "";
    const ESC = "#";
    let i = 0;
    while (i < string.length) {
        if (string[i] === ESC) {
            let repeat = string.charCodeAt(++i);
            repeat += string[++i] === ESC ? 1 : 4;
            output += string[i++].repeat(repeat);
            continue;
        }
        output += string[i++];
    }
    return output;
}

const flag = process.argv[2];
const input = process.argv[3];
const output = process.argv[4];

if (flag === "-e" || (flag === "--encode" && input && output)) {
    const data = fs.readFileSync(input, "utf-8");
    fs.writeFileSync(output, encode(data));
} else if (flag === "-d" || (flag === "--decode" && input && output)) {
    const data = fs.readFileSync(input, "utf-8");
    fs.writeFileSync(output, decode(data));
} else if (flag === "-h" || flag === "--help") {
    console.log("USAGE: node escape.js [-e,-d,-h] in.txt out.txt");
} else {
    console.log("Incorrect!");
    console.log("Type '-h' or '--help' for help");
    process.exit(1);
}
