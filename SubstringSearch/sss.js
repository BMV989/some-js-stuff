const string = "abcdcab";
const pattern = "ab";
const string2 = "Addabffg";
const pattern2 = "ffg";
const string1 = "the quick brown fox jumps over the lazy dog";
const pattern1 = "fox";

function bruteforce(string, pattern) {
  let ans = [];
  seraching: for (let i = 0; i <= string.length - pattern.length; ++i) {
    for (let j = 0; j < pattern.length; ++j) {
      if (string[i + j] !== pattern[j]) {
        continue seraching;
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

console.log(rabin_karp(string, pattern));
console.log(rabin_karp(string1, pattern1));
console.log(rabin_karp(string2, pattern2));
console.log(rabin_karp(string2, pattern));
