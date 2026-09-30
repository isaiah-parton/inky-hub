const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateApiKey(length: number = 8) {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error("length must be a positive integer");
  }

  const charsetLength = CHARSET.length; // 62
  // Largest multiple of 62 that fits in a byte (248), used to avoid modulo bias
  const maxValid = 256 - (256 % charsetLength);

  let result = "";
  while (result.length < length) {
    const bytes = new Uint8Array(length - result.length + 8); // small buffer for rejected bytes
    crypto.getRandomValues(bytes);

    for (const byte of bytes) {
      if (byte < maxValid) {
        result += CHARSET[byte % charsetLength];
        if (result.length === length) break;
      }
    }
  }

  return result;
}
