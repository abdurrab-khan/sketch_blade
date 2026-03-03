/** @type {import('jest').Config} */
module.exports = {
   preset: "ts-jest",
   testEnvironment: "node",
   roots: ["<rootDir>/src/test"],
   testMatch: ["**/*.test.ts"],
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^@tldraw/sync-core$": "<rootDir>/src/test/__mocks__/tldraw-sync-core.ts",
   },
   transform: {
      "^.+\\.ts$": [
         "ts-jest",
         {
            tsconfig: {
               module: "commonjs",
               strict: false,
               esModuleInterop: true,
               allowSyntheticDefaultImports: true,
            },
            diagnostics: false,
         },
      ],
   },
   setupFiles: ["<rootDir>/src/test/jest.setup.ts"],
   testTimeout: 30000,
   collectCoverageFrom: [
      "src/middlewares/**/*.ts",
      "src/controllers/**/*.ts",
      "!src/test/**",
   ],
};
