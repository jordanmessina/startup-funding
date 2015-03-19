// This file is a helper that assembles arrays of bower asset paths

var path = require('path');

var bowerRoot = 'bower_components';

var styles = [
  { name: 'bootstrap', src: 'dist/css/bootstrap.css', min: 'dist/css/bootstrap.min.css' },
  { name: 'bootstrap-tour', src: 'build/css/bootstrap-tour.css', min: 'build/css/bootstrap-tour.min.css' }
];

var scripts = [
  { name: 'jquery', src: 'dist/jquery.js', min: 'dist/jquery.min.js' },
  { name: 'angular', src: 'angular.js', min: 'angular.min.js' },
  { name: 'bootstrap', src: 'dist/js/bootstrap.js', min: 'dist/js/bootstrap.min.js' },
  { name: 'bootstrap-tour', src: 'build/js/bootstrap-tour.js', min: 'build/js/bootstrap-tour.min.js' }
];

module.exports.styles = {
  src: styles.map(function(s) { return path.join(bowerRoot, s.name, s.src)}),
  min: styles.map(function(s) { return path.join(bowerRoot, s.name, s.min)})
};

module.exports.scripts = {
  src: scripts.map(function(s) { return path.join(bowerRoot, s.name, s.src)}),
  min: scripts.map(function(s) { return path.join(bowerRoot, s.name, s.min)})
};
