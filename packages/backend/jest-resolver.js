const enhancedResolve = require("enhanced-resolve");

const resolver = enhancedResolve.create.sync({
  conditionNames: ["require", "node", "default", "import"],
  extensions: [".js", ".json", ".node", ".ts"],
});

module.exports = (request, options) => resolver(options.basedir, request);
