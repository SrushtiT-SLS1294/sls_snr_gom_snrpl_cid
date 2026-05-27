// karma.conf.js
// Karma configuration for running UI5 QUnit + OPA5 tests headlessly in CI/CD

"use strict";

module.exports = function (config) {
    config.set({

        // ─── Frameworks ───────────────────────────────────────────────────────
        frameworks: ["ui5"],

        // ─── UI5 Configuration ────────────────────────────────────────────────
        ui5: {
            type: "application",
            mode: "html",           // Use HTML-based test runners
            testpage: "webapp/test/unit/unitTests.qunit.html",  // entry point

        },

        // ─── Test Files to Watch ─────────────────────────────────────────────
        files: [
            // Served but not watched by default (UI5 loads them)
        ],

        // ─── Preprocessors ───────────────────────────────────────────────────
        preprocessors: {},

        // ─── Reporters ───────────────────────────────────────────────────────
        reporters: ["progress", "junit"],

        // JUnit reporter output for SAP CI/CD Service to parse test results
        junitReporter: {
            outputDir: "test-results",
            outputFile: "TEST-ui5-unit.xml",
            suite: "UI5 Unit Tests",
            useBrowserName: false,
            nameFormatter: undefined,
            classNameFormatter: undefined
        },

        // ─── Browser ─────────────────────────────────────────────────────────
        // Use ChromeHeadless for CI/CD (no display required)
        browsers: ["ChromeHeadless"],

        customLaunchers: {
            ChromeHeadlessCI: {
                base: "ChromeHeadless",
                flags: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                ]
            }
        },

        // ─── General Settings ────────────────────────────────────────────────
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,       // Single run in CI
        singleRun: true,        // Exit after tests finish
        concurrency: Infinity,
        captureTimeout: 60000,
        browserDisconnectTimeout: 10000,
        browserNoActivityTimeout: 60000
    });
};
