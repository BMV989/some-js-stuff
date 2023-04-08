function entropy(string) {
    string = string.trim();
    let alphabet = {};
    if (string.length === 1) {
        return 1;
    }
    for (let i = 0; i < string.length; ++i) {
        if (string[i] in alphabet) {
            alphabet[string[i]]++;
        } else {
            alphabet[string[i]] = 1;
        }
    }
    if (Object.keys(alphabet).length === 1) {
        return 0;
    }
    let ans = 0;
    for (i in alphabet) {
        let pi = alphabet[i] / string.length;
        ans -= pi * Math.log2(pi);
    }
    return ans;
}

const message = process.argv[2];
console.log(entropy(message));
