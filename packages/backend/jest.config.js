/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  preset: "@shelf/jest-mongodb",
  transform: {
    "\\.[jt]s$": "babel-jest",
  },
  // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
  watchPathIgnorePatterns: ["<rootDir>/globalConfig.json"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
