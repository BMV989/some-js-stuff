const fs = require("fs");

function encode(string) {
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
    let count = 0;
    let sequence = "";
    strict_enumerator().forEach((element) => {
        while (element.counter > 128) {
            output += String.fromCharCode(255) + element.symbol;
            element.counter -= 128;
        }
        if (element.counter === 1 && count < 127) {
            count++;
            sequence += element.symbol;
            return;
        }
        output += String.fromCharCode(count) + sequence;
        sequence = "";
        count = 0;
        output += String.fromCharCode(127 + element.counter) + element.symbol;
    });
    if (sequence) output += String.fromCharCode(count) + sequence;
    return output;
}

function decode(string) {
    let output = "";
    let i = 0;
    while (i < string.length) {
        let repeat = string.charCodeAt(i);
        if (repeat < 128) {
            for (let j = 1; j <= repeat; ++j) {
                output += string[i + j];
            }
            i += repeat + 1;
            continue;
        }
        output += string[i + 1].repeat(repeat - 127);
        i += 2;
    }
    return output;
}

const flag = process.argv[2];
const input = process.argv[3];
const output = process.argv[4];

if ((flag === "-e" || flag === "--encode") && input && output) {
    const data = fs.readFileSync(input, "utf-8");
    fs.writeFileSync(output, encode(data));
} else if ((flag === "-d" || flag === "--decode") && input && output) {
    const data = fs.readFileSync(input, "utf-8");
    fs.writeFileSync(output, decode(data));
} else if ((flag === "-t" || flag === "--test") && input && output) {
    const data = fs.readFileSync(input, "utf-8");
    let test = encode(data);
    test = encode(test);
    test = decode(test);
    test = decode(test);
    fs.writeFileSync(output, test);
} else if (flag === "-h" || flag === "--help") {
    console.log("USAGE: node jump.js [-e,-d,-h] in.txt out.txt");
} else {
    console.log("Incorrect!");
    console.log("Type '-h' or '--help' for help");
    process.exit(1);
}
