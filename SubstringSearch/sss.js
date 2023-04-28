const fs = require("fs");
function bruteforce(string, pattern) {
  let ans = [];
  searching: for (let i = 0; i <= string.length - pattern.length; ++i) {
    for (let j = 0; j < pattern.length; ++j) {
      if (string[i + j] !== pattern[j]) {
        continue searching;
      }
    }
    ans.push(i);
  }
  return ans;
}

function rabin_karp(string, pattern, p = 5) {
  let ans = [];
  function hash(string) {
    let hashValue = 0;
    for (let i = 0; i < string.length; i++) {
      hashValue += string.charCodeAt(i) * 2 ** i;
    }
    return hashValue % p;
  }
  const n = string.length;
  const m = pattern.length;
  const patternHash = hash(pattern);
  let hashReducer = hash(string.substr(0, m), p);
  for (let i = 0; i <= n - m; ++i) {
    if (hashReducer === patternHash && string.slice(i, i + m) === pattern) {
      ans.push(i);
    }
    hashReducer -= string.charCodeAt(i) % p;
    if (hashReducer % 2) {
      hashReducer += p;
    }
    hashReducer =
      (hashReducer * 0.5 + string.charCodeAt(i + m) * 2 ** (m - 1)) % p;
  }
  return ans;
}

function DFA(text, pattern) {
  const transitions = {};
  const states = Array(pattern.length + 1)
    .fill()
    .map(() => new Set());
  for (let i = 0; i <= pattern.length; i++) {
    for (const c of new Set(pattern)) {
      let j = Math.min(pattern.length, i + 1);
      while (j > 0 && !pattern.slice(0, j).includes(pattern.slice(0, i) + c)) {
        j--;
      }
      states[i].add([c, j]);
    }
    if (i < pattern.length) {
      transitions[[i, pattern[i]]] = i + 1;
    }
  }
  const acceptingStates = states.reduce((acc, state, i) => {
    if (i === pattern.length || states[i + 1].size === 0) {
      return acc.concat(i);
    } else {
      return acc;
    }
  }, []);

  const search = () => {
    const occurrences = [];
    let i = 0;
    while (i < text.length) {
      let j = 0;
      let state = 0;
      while (j < pattern.length && transitions[[state, text[i + j]]]) {
        state = transitions[[state, text[i + j]]];
        j++;
      }
      if (acceptingStates.includes(state)) {
        occurrences.push(i);
      }
      if (j === 0) {
        i++;
      } else {
        i += j;
      }
    }
    return occurrences;
  };
  return search();
}

const stringText = fs.readFileSync("test.txt", "utf8");

console.log(rabin_karp(stringText, "War"));
console.log(bruteforce(stringText, "War"));
console.log(DFA(stringText, "War"));
