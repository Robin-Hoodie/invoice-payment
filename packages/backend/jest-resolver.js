const enhancedResolve = require("enhanced-resolve");

const resolver = enhancedResolve.create.sync({
  conditionNames: ["require", "node", "default", "import"],
  extensions: [".js", ".json", ".node", ".ts"],
});

module.exports = (request, options) => {
  if (request === "uint8array-tools" || request === "tiny-secp256k1") {
    return resolver(options.basedir, request);
  }
  return options.defaultResolver(request, options);
};
