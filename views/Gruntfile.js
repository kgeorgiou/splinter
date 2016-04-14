module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: [
                    'scripts/config.js',
                    'app.js',
                    'controllers/*.js'
                ],
                dest: 'build/js/splinter.js'
            },
            css: {
                src: [
                    'css/*.css'
                ],
                dest: 'build/css/splinter.css'
            }
        },

        uglify: {
            js: {
                src: 'build/js/splinter.js',
                dest: 'build/js/splinter.min.js'
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            }
        },

        watch: {
            js: {
                files: ['app.js'],
                tasks: ['concat:js', 'uglify'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['css/*.css'],
                tasks: ['concat:css', 'cssmin'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
        'concat',
        'uglify',
        'cssmin',
        'watch'
    ]);

};