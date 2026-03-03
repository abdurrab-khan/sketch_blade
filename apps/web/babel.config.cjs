// Transform import.meta.env to process.env for Jest compatibility (Vite → Node)
function transformImportMetaPlugin() {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === "import" && path.node.property.name === "meta") {
          path.replaceWithSourceString("({ env: process.env })");
        }
      },
    },
  };
}

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
  ],
  plugins: [transformImportMetaPlugin],
};
