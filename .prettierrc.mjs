/** @type {import("prettier").Options} */
const config = {
  bracketSpacing: true,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 70,
  jsdocPrintWidth: 70,
  singleAttributePerLine: true,
  plugins: ["./node_modules/prettier-plugin-jsdoc/dist/index.js"],
};

export default config;
