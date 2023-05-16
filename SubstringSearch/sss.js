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

function boyer_moore(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  if (m === 0) {
    return [];
  }

  function buildTrueBadCharTable(pattern) {
    const table = {};
    const alphabet = Array.from(new Set(pattern));
    for (const s of alphabet) {
      table[s] = [];
      for (let i = 0; i <= m; ++i) {
        table[s][i] = Math.abs(i - pattern.lastIndexOf(s, i));
      }
    }
    table["*"] = [];
    for (let i = 0; i <= m; ++i) {
      table["*"][i] = i;
    }
    return table;
  }
  console.log(buildTrueBadCharTable(pattern));
  function buildBadCharTable(pattern) {
    const table = new Map();
    for (let i = 0; i < pattern.length; i++) {
      table.set(pattern[i], i);
    }
    return table;
  }

  function buildGoodSuffixTable(pattern) {
    function isPrefix(pattern, p) {
      for (let i = p, j = 0; i < pattern.length; i++, j++) {
        if (pattern[i] !== pattern[j]) {
          return false;
        }
      }
      return true;
    }
    function getSuffixLength(pattern, p) {
      let len = 0;
      for (
        let i = p, j = pattern.length - 1;
        i >= 0 && pattern[i] === pattern[j];
        i--, j--
      ) {
        len++;
      }
      return len;
    }

    const table = new Array(pattern.length).fill(0);
    let lastPrefixPosition = pattern.length;
    for (let i = pattern.length - 1; i >= 0; i--) {
      if (isPrefix(pattern, i + 1)) {
        lastPrefixPosition = i + 1;
      }
      table[pattern.length - i - 1] =
        lastPrefixPosition - i + pattern.length - 1;
    }
    for (let i = 0; i < pattern.length - 1; i++) {
      const suffixLen = getSuffixLength(pattern, i);
      if (pattern[i - suffixLen] !== pattern[pattern.length - 1 - suffixLen]) {
        table[pattern.length - 1 - suffixLen] = Math.min(
          table[pattern.length - 1 - suffixLen],
          pattern.length - 1 - i + suffixLen
        );
      }
    }
    return table;
  }

  const badCharTable = buildTrueBadCharTable(pattern);
  const goodSuffixTable = buildGoodSuffixTable(pattern);

  const occurrences = [];
  let i = m - 1;
  let j = m - 1;
  while (i < n) {
    if (text[i] === pattern[j]) {
      if (j === 0) {
        occurrences.push(i);
        i += m;
        j = m - 1;
      } else {
        i--;
        j--;
      }
    } else {
      // const badCharIndex = badCharTable.get(text[i]);
      // const badCharShift = j - (badCharIndex === undefined ? -1 : badCharIndex);
      // bad implementation
      const badCharShift =
        text[i] in badCharTable
          ? badCharTable[text[i]][j]
          : badCharTable["*"][j];
      const goodSuffixShift = goodSuffixTable[j];
      i += Math.max(badCharShift, goodSuffixShift);
      j = m - 1;
    }
  }
  return occurrences;
}

const stringText = fs.readFileSync("test.txt", "utf8");

//console.time("DFA");
//console.log(DFA(stringText, "War"));
//console.timeEnd("DFA");
console.time("brute");
console.log(bruteforce(stringText, "War"));
console.timeEnd("brute");
console.time("boyer");
console.log(boyer_moore(stringText, "War"));
console.timeEnd("boyer");
