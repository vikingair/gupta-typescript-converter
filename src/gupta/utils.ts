import fs from "node:fs/promises";

// automatically uses correct encoding
export const readFile = async (filePath: string) => {
  // 1. Read the raw bytes (Buffer), NOT "utf8" string
  const buffer = await fs.readFile(filePath);

  // 2. Check for Byte Order Marks (BOM)
  // UTF-8 BOM: EF BB BF
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    // Slice off the 3 bytes of BOM and decode rest as utf-8
    return new TextDecoder("utf-8").decode(buffer.subarray(3));
  }

  // UTF-16 LE BOM: FF FE
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    // Slice off 2 bytes and decode
    return new TextDecoder("utf-16le").decode(buffer.subarray(2));
  }

  // UTF-16 BE BOM: FE FF
  if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(buffer.subarray(2));
  }

  // 3. Fallback: No BOM found
  // It's likely standard UTF-8 (without BOM) or ANSI/ASCII.
  // Standard UTF-8 is the safest default for web/node.
  return new TextDecoder("utf-8").decode(buffer);
};
