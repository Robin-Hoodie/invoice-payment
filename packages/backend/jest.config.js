/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  transform: {
    "\\.[jt]s$": "babel-jest",
  },
  // Workaround for https://github.com/bitcoinjs/tiny-secp256k1/issues/73
  resolver: "<rootDir>/jest-resolver.js",
};
