// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
'use strict';

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'src/**/*.spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.spec.js': ['webpack','sourcemap']
        },

        // set up webpack for testing
        // TODO : Ideal is to get this from somewhere...
        webpack: {
            module: {
                rules: require('../webpack/rules.js')
            },
            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i.e.
            noInfo: true,
            // and use stats to turn off verbose output
            stats: {
                // options i.e. 
                chunks: false
            }
        },

        plugins: [
            require('karma-webpack'),
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-sourcemap-loader'
        ],

        reporters: ['dots'],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true
        },
        
        client: {
            captureConsole: true,
            config: {
                browserConsoleLogOptions: true
            }
        },

        // web server port
        browserNoActivityTimeout: 100000,
        port: 9999,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
