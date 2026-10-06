const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  const corruptedContent = fs.readFileSync(filePath);
  
  // The file is currently UTF-8 encoded, representing characters that were originally Windows-1252
  // Let's decode it back.
  // Wait, if it was read as 1252 and written as UTF-8, it means each byte of the original UTF-8
  // was treated as a 1252 character, and then encoded into UTF-8.
  // So to reverse: read the file as UTF-8 string, then convert each character's charCode back to a byte,
  // then decode the byte array as UTF-8.
  
  const text = fs.readFileSync(filePath, 'utf8');
  const buffer = Buffer.alloc(text.length);
  for(let i=0; i<text.length; i++) {
    // Some charCodes might be mapped differently if Windows-1252 was strictly used.
    // Let's try simple binary string first:
    buffer[i] = text.charCodeAt(i) & 0xFF;
  }
  
  // Actually, windows-1252 is NOT exactly 1:1 with latin1 (iso-8859-1).
  // E.g. char code 0x80 in windows-1252 is Euro symbol '€' (U+20AC).
  // So if the original UTF-8 byte was 0x80, it was read as '€', and saved as UTF-8 '€' (E2 82 AC).
  // We need to map it back from '€' to 0x80.
  
  // Let's use iconv-lite if available, but it might not be.
  // Instead, let's just do a reverse mapping of Windows-1252.
  const win1252Rev = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
    0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
    0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
    0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
  };
  
  const originalBytes = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c <= 0xFF && !(c >= 0x80 && c <= 0x9F && win1252Rev[c] === undefined)) {
      originalBytes.push(c);
    } else if (win1252Rev[c] !== undefined) {
      originalBytes.push(win1252Rev[c]);
    } else {
      // If we can't map it, just keep the lower 8 bits (fallback)
      originalBytes.push(c & 0xFF);
    }
  }
  
  const restoredText = Buffer.from(originalBytes).toString('utf8');
  
  // Write back
  fs.writeFileSync(filePath, restoredText, 'utf8');
});
console.log('Fixed encoding in all HTML files.');
