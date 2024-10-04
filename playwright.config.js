// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './ui_tests', // Указываем относительный путь к директории с тестами
});
