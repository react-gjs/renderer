/** @param {number} char - A unicode character code. */
export const isUnicodeLetter = (char: number) => {
  return (
    (char >= 65 && char <= 90) || // A-Z
    (char >= 97 && char <= 122) // a-z
  );
};
