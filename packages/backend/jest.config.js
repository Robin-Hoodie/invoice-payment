/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  preset: "@shelf/jest-mongodb",
  transform: {
    "\\.[jt]s$": "babel-jest",
  },
  // Workaround for https://github.com/bitcoinjs/tiny-secp256k1/issues/73
  resolver: "<rootDir>/jest-resolver.js",
  // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
  watchPathIgnorePatterns: ["<rootDir>/globalConfig.json"],
};
