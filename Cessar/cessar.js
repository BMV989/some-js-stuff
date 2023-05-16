const fs = require("fs");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function cipher(message, offset) {
  let ans = "";
  for (const l of message) {
    ans += alphabet.includes(l)
      ? alphabet[(alphabet.indexOf(l) + offset) % alphabet.length]
      : l;
  }
  return ans;
}
function getOffset(sample, cipheredMessage) {
  function getFrequences(string) {
    const frequencies = {};
    for (const l of alphabet) {
      const count = [...string].filter((char) => char === l).length;
      frequencies[l] = count / string.length;
    }
    return frequencies;
  }

  const globalFrequencies = getFrequences(sample);
  const localFrequencies = getFrequences(cipheredMessage);
  //console.log(globalFrequencies);
  //console.log(localFrequencies);
  let bestOffset = -1;
  let min = Infinity;
  for (let offset = 0; offset < alphabet.length; offset++) {
    let sum = 0;
    for (let i = 0; i < alphabet.length; ++i) {
      const shifted = alphabet[(i + offset) % alphabet.length];
      sum += Math.pow(
        globalFrequencies[shifted] - localFrequencies[alphabet[i]],
        2
      );
    }
    if (sum < min) {
      min = sum;
      bestOffset = offset;
      //console.log(min);
      //console.log(bestOffset);
    }
  }
  const ans = alphabet.length - bestOffset;
  return ans === alphabet.length ? 0 : ans;
}

function decipher(cipheredMessage, offset) {
  let ans = "";
  for (const l of cipheredMessage) {
    let index = alphabet.indexOf(l) - offset;
    if (index < 0) index += alphabet.length;
    ans += alphabet.includes(l) ? alphabet[index % alphabet.length] : l;
  }
  return ans;
}

const sample = fs.readFileSync("sample.txt").toString();
const testSample = fs.readFileSync("sample2.txt").toString();
const yetAnotherTestSample = fs.readFileSync("sample3.txt").toString();

const trueOffset = 6;

const message = yetAnotherTestSample;

const offset = getOffset(sample, cipher(message, trueOffset));

console.log(decipher(cipher(message, trueOffset), offset));

console.log(offset);
console.log(trueOffset === offset);
