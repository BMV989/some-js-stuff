const fs = require("fs");
const zlib = require("zlib");

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

class Node {
  constructor(left, right, frequence, value) {
    this.left = left;
    this.right = right;
    this.frequence = frequence;
    this.value = value;
  }
}

function huffmanEncode(string) {
  string = string.trim() + "\0";
  let alphabet = {};
  for (let i = 0; i < string.length; ++i) {
    string[i] in alphabet ? alphabet[string[i]]++ : (alphabet[string[i]] = 1);
  }
  function generateTree(alphabet) {
    let nodes = [];
    for (element in alphabet) {
      nodes.push(new Node(null, null, alphabet[element], element));
    }
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequence - b.frequence);
      let left = nodes.shift();
      let right = nodes.shift();
      let node = new Node(left, right, left.frequence + right.frequence, null);
      nodes.push(node);
    }
    return nodes[0];
  }

  function getCodes(tree) {
    let codes = {};
    function dfs(node, code) {
      if (node.value) {
        codes[node.value] = code;
      } else {
        dfs(node.left, code + "0");
        dfs(node.right, code + "1");
      }
    }
    dfs(tree, "");
    return codes;
  }

  const codes = getCodes(generateTree(alphabet));
  let output = "";
  for (let i = 0; i < string.length; i++) {
    output += codes[string[i]];
  }
  return [output, codes];
}

function encodedMessage(binaryString, codes) {
  let input = binaryString;
  let output = "";
  while (input.length % 8 !== 0) {
    input += "0";
  }
  for (let i = 0; i < input.length; i += 8) {
    output += String.fromCharCode(parseInt(input.slice(i, i + 8), 2));
  }
  return (
    output +
    "\n" +
    zlib.deflateSync(JSON.stringify(codes), { level: 9 }).toString()
  );
}

function huffmanDecode(input, codes) {
  if (typeof input === "object") {
    [input, codes] = input;
  }
  let sample = "";
  let output = "";
  for (const bit of input) {
    sample += bit;
    if (Object.values(codes).includes(sample)) {
      output += Object.keys(codes).find((k) => codes[k] === sample);
      sample = "";
      if (output[output.length - 1] === "\0") break;
    }
  }
  return output.slice(0, output.length - 1);
}

const iFile = process.argv[2];
const oFile = process.argv[3];

const string = fs.readFileSync(iFile).toString();
[encodedString, codes] = huffmanEncode(string);

fs.writeFileSync(oFile, `Message:\n${encodedString}\n`);
fs.appendFileSync(oFile, "Binary dictionary:\n");
fs.appendFileSync(oFile, `${JSON.stringify(codes)}\n`);
console.log(`Entropy of string: ${entropy(string)}`);
console.log(
  `Entriopy of encoded string: ${entropy(encodedMessage(encodedString, codes))}`
);
console.log(
  `Compression ratio: ${(
    ((string.length - encodedMessage(encodedString, codes).length) /
      string.length) *
    100
  ).toFixed(2)}%`
);
fs.appendFileSync(
  oFile,
  `Decoded string:\n${huffmanDecode(encodedString, codes)}`
);
