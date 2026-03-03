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

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src/test"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      {
        configFile: false,
        babelrc: false,
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
        ],
        plugins: [transformImportMetaPlugin],
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.css$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["node_modules/(?!(tldraw|@tldraw|@radix-ui)/)"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  setupFiles: ["<rootDir>/src/test/jest.setup.ts"],
  testTimeout: 15000,
  collectCoverageFrom: [
    "src/redux/slices/**/*.ts",
    "src/utils/**/*.ts",
    "src/pages/**/*.tsx",
    "!src/test/**",
  ],
};
