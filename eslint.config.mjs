import fs from "node:fs";
import path from "node:path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const ignore = [
  ".next",
  ".git",
  "node_modules",
  ".DS_Store",
  "dist",
  "*.log",
];

const repo = path.dirname(__dirname);
const dirs = fs
  .readdirSync(repo)
  .filter((file) => !ignore.includes(file))
  .filter((file) => fs.statSync(path.join(repo, file)).isDirectory());

const configs = dirs
  .filter((dir) => dir !== "node_modules")
  .map((dir) => ({
    name: `eslint-config-${dir}`,
    rules: {},
  }));

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      ".next/",
      "coverage/",
      "*.log",
      "build/",
    ],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
    },
  },
];