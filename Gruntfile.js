module.exports = function(grunt) {

    // Tasks
    grunt.initConfig({
        jshint: {
            all: ['app/js/node.js', 'app/js/functions.js', 'app/js/main.js', 'app/js/params.js']
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
                './node_modules/read-file/**',
                './node_modules/request/**'
            ]
        }
    });




    // Process
    grunt.registerTask('default', [
        'jshint'
    ]);
    grunt.registerTask('build', [
        'jshint',
        'nodewebkit'
    ]);




    // Require
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
}