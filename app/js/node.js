var fs = require('fs');
var request = require('request');
var file = require('read-file');
var WindowManager = require('node-webkit-window-manager').windowManager;
var gui = require('nw.gui');
var execFile = require('child_process').execFile, child;