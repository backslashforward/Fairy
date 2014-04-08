/* global module */

'use strict';

module.exports = function(config) {
  config.set({
    basePath: './',
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/components/vat/*.js',
      'app/expenses/create/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: ['karma-chrome-launcher', 'karma-jasmine']
  });
};
