window.ondragover = function(e) {e.preventDefault(); return false; }
window.ondrop = function(e) {e.preventDefault(); return false; }

var execFile = require('child_process').execFile, child;
var path = require('path');
var gui = require('nw.gui');