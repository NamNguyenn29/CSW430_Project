export const base64Decode = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // Pad string if necessary
  let paddedStr = str.replace(/=+$/, '');
  const paddingNeeded = 4 - (paddedStr.length % 4);
  if (paddingNeeded !== 4) {
    paddedStr += '='.repeat(paddingNeeded);
  }

  let result = '';
  let i = 0;
  while (i < paddedStr.length) {
    const c1 = chars.indexOf(paddedStr.charAt(i++));
    const c2 = chars.indexOf(paddedStr.charAt(i++));
    const c3 = chars.indexOf(paddedStr.charAt(i++));
    const c4 = chars.indexOf(paddedStr.charAt(i++));

    const byte1 = (c1 << 2) | (c2 >> 4);
    const byte2 = ((c2 & 15) << 4) | (c3 >> 2);
    const byte3 = ((c3 & 3) << 6) | c4;

    result += String.fromCharCode(byte1);
    if (c3 !== 64 && paddedStr.charAt(i - 2) !== '=') {
      result += String.fromCharCode(byte2);
    }
    if (c4 !== 64 && paddedStr.charAt(i - 1) !== '=') {
      result += String.fromCharCode(byte3);
    }
  }
  return result;
};

export const decodeJwt = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = base64Decode(base64);
    
    // Decode UTF-8 correctly
    const utf8Decoded = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(utf8Decoded);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
};
