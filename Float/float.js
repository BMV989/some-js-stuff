function float(number) {
    const S = number >= 0 ? 0 : 1;
    number = Math.abs(number);
    let P = Math.floor(Math.log2(number));
    if (P < -126) P = -127;
    let M = P !== -127 ? number / 2 ** P - 1 : number / 2 ** -126;
    let bits = S.toString();
    let temp = (P + 127).toString(2).slice(0, 8);
    while (temp.length < 8) {
        temp = "0" + temp;
    }
    bits += temp;
    temp = P !== -127 ? M.toString(2).slice(2, 24) : M.toString(2).slice(2, 24);
    while (temp.length < 23) {
        temp += "0";
    }
    bits += temp;
    let output = "";
    let i = 0;
    while (i < bits.length) {
        output += parseInt(bits.slice(i, i + 4), 2)
            .toString(16)
            .toUpperCase();
        i += 4;
    }
    return output;
}

function defloat(hex) {
    let bits = "";
    let temp = "";
    for (let i = 0; i < hex.length; ++i) {
        temp = parseInt(hex[i], 16).toString(2);
        bits += "0".repeat(4 - temp.length) + temp;
    }
    if (bits.slice(1, 9) === "1".repeat(8)) {
        if (bits.slice(9, 32) === "0".repeat(23))
            return bits[0] === "0" ? Infinity : -Infinity;
        return NaN;
    }
    const S = bits[0] === "1" ? -1 : 1;
    let P = parseInt(bits.slice(1, 9), 2) - 127;
    let M = 0;
    for (let i = 0; i < bits.slice(9).length; ++i) {
        M += bits.slice(9)[i] * 2 ** -(i + 1);
    }
    //const M = "." + Math.floor(parseInt(bits.slice(9), 2) / 8.3886e-6);
    return P !== -127 ? (S * (1 + M) * 2 ** P) : (S * M * 2 ** -126);
}

let test = process.argv[2];
test = float(test);
test = defloat(test);
console.log(test);
