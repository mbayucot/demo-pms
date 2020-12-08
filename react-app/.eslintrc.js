module.exports = {
  extends: [
    "react-app", // Create React App base settings
    "eslint:recommended", // recommended ESLint rules
    "plugin:@typescript-eslint/recommended", // recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with Prettier.
    "plugin:prettier/recommended",
    "plugin:testing-library/recommended",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:styled-components-a11y/recommended",
    "plugin:cypress/recommended",
    "plugin:jest-formatting/recommended",
    "plugin:jsdoc/recommended",
  ],
  rules: {},
  plugins: [
    "testing-library",
    "jest-dom",
    "jest",
    "jsx-a11y",
    "styled-components-a11y",
    "simple-import-sort",
    "cypress",
    "jest-formatting",
    "jsdoc",
  ],
};
