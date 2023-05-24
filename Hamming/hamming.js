// hamming(8, 4) default implementation (proof of concept model)
function encode(binaryMessage4) {
  if (binaryMessage4.length !== 4)
    throw new Error("We are not working with none 4bits binary messages, sry(");
  const p1 = binaryMessage4[0] ^ binaryMessage4[1] ^ binaryMessage4[3];
  const p2 = binaryMessage4[0] ^ binaryMessage4[2] ^ binaryMessage4[3];
  const p3 = binaryMessage4[1] ^ binaryMessage4[2] ^ binaryMessage4[3];
  const partlyEncodedMessage = [
    p1,
    p2,
    binaryMessage4[0],
    p3,
    binaryMessage4[1],
    binaryMessage4[2],
    binaryMessage4[3],
  ];
  const p0 = partlyEncodedMessage.reduce((element, acc) => (acc ^= element));
  return [p0.toString(), ...partlyEncodedMessage.map((e) => e.toString())].join(
    ""
  );
}
// s0 s1 s2 d1 s3 d2 d3 d4

function decode(encodedBinaryMessge8) {
  if (encodedBinaryMessge8.length !== 8)
    throw new Error("Can't decode this non-standard binary message");
  const s1 =
    encodedBinaryMessge8[1] ^
    encodedBinaryMessge8[3] ^
    encodedBinaryMessge8[5] ^
    encodedBinaryMessge8[7];
  const s2 =
    encodedBinaryMessge8[2] ^
    encodedBinaryMessge8[3] ^
    encodedBinaryMessge8[6] ^
    encodedBinaryMessge8[7];
  const s3 =
    encodedBinaryMessge8[4] ^
    encodedBinaryMessge8[5] ^
    encodedBinaryMessge8[6] ^
    encodedBinaryMessge8[7];
  const s0 = [...encodedBinaryMessge8].reduce((e, acc) => (acc ^= e));

  let errorIndex = -1;
  if (s0 === 1) {
    errorIndex = parseInt(`${s3}${s2}${s1}`, 2);
  }
  if (s0 === 0 && (s1 !== 0 || s2 !== 0 || s3 !== 0)) {
    console.log("There are two mistakes can't highlight one!");
  }
  encodedBinaryMessge8 = [...encodedBinaryMessge8];
  if (errorIndex !== -1) {
    encodedBinaryMessge8[errorIndex] = parseInt(
      encodedBinaryMessge8[errorIndex]
    );
  }
  let ans = "";
  encodedBinaryMessge8.forEach((e) => {
    if (typeof e === "number") {
      ans += `\x1b[31m${e}\x1b[0m`;
    } else {
      ans += e;
    }
  });
  return ans;
}

const flag = process.argv[2];
const message = process.argv[3];

if (flag === "-e") {
  console.log(encode(message));
}

if (flag === "-d") {
  const decodedMessage = decode(message);
  console.log(decodedMessage);
}
