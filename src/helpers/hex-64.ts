import web3 from "web3";

export function hexToBase64(hexstring: string) {
  // remove 0x from the beginning of the string
  hexstring = hexstring.substring(2);
  return encodeURIComponent(
    btoa(
      hexstring
        .match(/\w{2}/g)
        .map(function (a) {
          return String.fromCharCode(parseInt(a, 16));
        })
        .join("")
    )
  );
}

export function base64ToHex(str: string) {
  const raw = atob(decodeURIComponent(str));
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }
  let toChecksum = "0x" + result;
  return web3.utils.toChecksumAddress(toChecksum);
}
