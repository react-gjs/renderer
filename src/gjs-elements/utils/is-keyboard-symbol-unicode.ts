const SPECIAL_KEYBOARD_SYMBOLS_UNICODE = [
  33, // !
  64, // @
  35, // #
  36, // $
  37, // %
  94, // ^
  38, // &
  42, // *
  40, // (
  41, // )
  95, // _
  43, // +
  45, // -
  61, // =
  91, // [
  93, // ]
  123, // {
  125, // }
  58, // :
  59, // ;
  34, // "
  39, // '
  44, // ,
  46, // .
  47, // /
  92, // \
  124, // |
  63, // ?
  126, // ~
  96, // `
  62, // >
  60, // <
];

/**
 * Checks if the given unicode character is a printable keyboard
 * symbol.
 *
 * @param {number} char - A unicode character code.
 */
export const isKeyboardSymbol = (char: number) => {
  return (
    // A-Z
    (char >= 65 && char <= 90) ||
    // a-z
    (char >= 97 && char <= 122) ||
    // 0-9
    (char >= 48 && char <= 57) ||
    // Special Symbols
    SPECIAL_KEYBOARD_SYMBOLS_UNICODE.includes(char)
  );
};
