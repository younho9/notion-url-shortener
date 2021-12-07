export interface CharsetIndex {
  byInt: Record<number, string>;
  byChar: Record<string, number>;
  length: number;
}

export const indexCharset = (charset: string[]): CharsetIndex => {
  const byInt: Record<number, string> = {};
  const byChar: Record<string, number> = {};

  for (const [i, char] of Array.from(charset.entries())) {
    byInt[i] = char;
    byChar[char] = i;
  }

  return {byInt, byChar, length: charset.length};
};

export const encode = (integer: number, {length: max, byInt}: CharsetIndex) => {
  if (integer === 0) {
    return byInt[0];
  }

  let string_ = '';

  while (integer > 0) {
    string_ = byInt[integer % max] + string_;
    integer = Math.floor(integer / max);
  }

  return string_;
};

export const encodeWithLeftPad = (
  integer: number,
  charsetIndex: CharsetIndex,
  maxLength: number,
) => encode(integer, charsetIndex).padStart(maxLength, encode(0, charsetIndex));

export const decode = (
  string_: string,
  {length: max, byChar}: CharsetIndex,
) => {
  let integer = 0;

  for (const [i, char] of Array.from(string_.split('').entries())) {
    integer += byChar[char] * max ** (string_.length - i - 1);
  }

  return integer;
};
