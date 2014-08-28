module.exports = function(grunt) {

    // Tasks
    grunt.initConfig({
        jshint: {
            all: ['app/js/node.js', 'app/js/first.js', 'app/js/functions.js', 'app/js/main.js']
        },

        nodewebkit: {
            options: {
                version: '0.10.2',
                platforms: ['win'],
                buildDir: '../builds/'
            },
            src: [
                './package.json',
                './app/**',
                './node_modules/node-webkit-window-manager/**',
                './node_modules/sqlite3/**'
            ]
        }
    });




    // Process
    grunt.registerTask('default', [
        'jshint'
    ]);
    grunt.registerTask('build', [
        'nodewebkit'
    ]);




    // Require
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
}