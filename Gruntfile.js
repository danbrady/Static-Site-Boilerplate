/* jshint node:true */
module.exports = function(grunt) {
    'use strict';

    // Auto load all grunt modules
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set configuration variables
        config: {
            srcDir : 'src',
            buildDir: 'build',
            uncompressedDir: 'images-uncompressed',
            generateJsSourcemaps: false
        },

        jshint: {
            options: {
                jshintrc: '<%= config.srcDir %>/js/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: '<%= config.srcDir %>/js/',
                    src: [
                        '**/*.js',
                        '!lib/**/*', // Ignore 'lib' files
                        '!*.{min,concat}.js' // Ignore any concatenated files (from previous processing)
                    ]
                }]
            }
        },

        concat: {
            options: {
                process: function(src, filepath) {
                  return '// File: ' + filepath + '\n' + src + '\n';
                }
            },
            dist: {
                src: [
                    '<%= config.buildDir %>/js/**/*.js',
                    '!<%= config.buildDir %>/js/lib/**/*.js', // Ignore 'lib' files
                    '!<%= config.buildDir %>/js/*.{min,concat}.js' // Ignore any minified/concatenated files (from previous processing)
                ],
                dest: '<%= config.buildDir %>/js/scripts.concat.js'
            }
        },

        uglify: {
            options: {
                sourceMap: '<%= config.generateJsSourcemaps %>'
            },
            build: {
                expand: true,
                flatten: true,
                src: [
                    '<%= config.srcDir %>/js/**/*.js',
                    '!<%= config.srcDir %>/js/lib/**/*.js',
                    '!<%= config.srcDir %>/Gruntfile.js',
                    '<%= config.buildDir %>/js/scripts.concat.js'
                ],
                ext: '.min.js',
                dest: '<%= config.buildDir %>/js/'
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 3 // Default: 3 (png)
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= config.srcDir %>/<%= config.uncompressedDir %>',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= config.srcDir %>/images'
                }]
            }
        },

        csslint: {
            options: {
                "adjoining-classes": false,
                "box-sizing": false
            },
            src: [
                '<%= config.buildDir %>/css/styles.css'
            ],
        },

        sass: {
            dist: {
                options: {
                    sourcemap: true,
                    style: 'expanded' // nested, compact, compressed, expanded
                },
                files: {
                    '<%= config.srcDir %>/css/styles.css': '<%= config.srcDir %>/sass/main.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                map: true,
                diff: true, // Creates .patch file
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Safari >= 6'
                ]
            },
            dist: {
                src: '<%= config.srcDir %>/css/styles.css',
                dest: '<%= config.srcDir %>/css/styles.css'
            }
        },

        cssmin: {
            options: {
                // Waiting for a css-clean plugin update to maintain sourcemap comment when minifying
                // https://github.com/GoalSmashers/clean-css/issues/125#issuecomment-40404184
            },
            minify: {
                expand: true,
                cwd: '<%= config.srcDir %>/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= config.srcDir %>/css/',
                ext: '.min.css'
            }

        },

        copy: {

            js: {
                expand: true,
                cwd: '<%= config.srcDir %>',
                src: [
                    'js/**/*.{js,map}',
                    '!js/**/*.concat.js'

                ],
                dest: '<%= config.buildDir %>'
            },

            // Keep this separate to run 'newer' on
            images: {
                expand: true,
                cwd: '<%= config.srcDir %>/images/',
                src: [
                    '**/*',
                ],
                dest: '<%= config.buildDir %>/images'
            },

            css: {
                expand: true,
                cwd: '<%= config.srcDir %>/css/',
                src: [
                    '*.{css,map}'
                ],
                dest: '<%= config.buildDir %>/css'
            }
        },

        includes: {
            htmlDynamic: {
                expand: true,
                cwd: '<%= config.srcDir %>',
                src: [
                    '**/*.html',
                    '!_includes/**/*'
                ],
                dest: '<%= config.buildDir %>'
            }

        },

        clean: ['<%= config.buildDir %>'],

        watch: {
            options: {
                livereload: true
            },

            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile', 'build']
            },

            scripts: {
                files: ['<%= config.srcDir %>/js/**/*.js'],
                tasks: ['newer:jshint:scripts', 'newer:copy:js', 'concat', 'newer:uglify']
            },

            imagesUncompressed: {
                files: ['<%= config.srcDir %>/<%= config.uncompressedDir %>/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin']
            },

            images: {
                files: ['<%= config.srcDir %>/images/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:copy:images']
            },

            sass: {
                files: ['<%= config.srcDir %>/sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin', 'copy:css']
            },

            // Need to recompile all HTMLs when an include changes
            htmlDynamic: {
                files: [
                    '<%= config.srcDir %>/_includes/**/*.html'
                ],
                tasks: ['includes']
            },

            html: {
                files: [
                    '<%= config.srcDir %>**/*.html'
                ],
                tasks: ['newer:includes']
            }

        }

    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'jshint:scripts', 'copy:js', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'copy', 'includes']);

};
