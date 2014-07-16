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
            uncompressedDir: 'src/images/_uncompressed'
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
                    cwd: '<%= config.srcDir %>',
                    src: [
                        'js/**/*.js',
                        '!js/lib/**/*', // Ignore 'lib' files
                        '!js/*.{min,concat}.js' // Ignore any concatenated files (from previous processing)
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
                    '<%= config.srcDir %>/js/**/*.js',
                    '!<%= config.srcDir %>/js/lib/**/*.js', // Ignore 'lib' files
                    '!<%= config.srcDir %>/js/*.{min,concat}.js' // Ignore any minified/concatenated files (from previous processing)
                ],
                dest: '<%= config.srcDir %>/js/script.concat.js'
            }
        },

        uglify: {
            build: {
                src: '<%= config.srcDir %>/js/script.concat.js',
                dest: '<%= config.srcDir %>/js/script.min.js'
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 3 // Default: 3 (png)
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= config.uncompressedDir %>/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= config.srcDir %>/images/'
                }]
            }
        },

        csslint: {
            options: {
                "adjoining-classes": false,
                "box-sizing": false
            },
            src: [
                '<%= config.srcDir %>/css/style.css'
            ],
        },

        sass: {
            dist: {
                options: {
                    sourcemap: true,
                    lineNumbers: true,
                    style: 'expanded' // nested, compact, compressed, expanded
                },
                files: {
                    '<%= config.srcDir %>/css/style.css' : '<%= config.srcDir %>/sass/style.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                map: true,
                browsers: [
                    // Support "borrowed" from Bootstrap
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            dist: {
                files: {
                    '<%= config.srcDir %>/css/style.css': '<%= config.srcDir %>/css/style.css'
                }
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
            main: {
                expand: true,
                cwd: '<%= config.srcDir %>',
                src: ['**/*.html', '**/*.map'],
                //src: ['images/**/*', 'js/**/*', 'css/**/*', 'json/**/*', '!**/backup/**'],
                dest: '<%= config.buildDir %>/'
            }
        },

        clean: ['<%= config.buildDir %>'],

        watch: {
            options: {
                livereload: true
            },

            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },

            scripts: {
                files: ['<%= config.srcDir %>/js/**/*.js'],
                tasks: ['newer:jshint:scripts', 'newer:concat', 'newer:uglify']
            },

            images: {
                files: ['<%= config.uncompressedDir %>/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin']
            },

            sass: {
                files: ['<%= config.srcDir %>/sass/*.scss'],
                tasks: ['sass']
            },

            css: {
                files: ['<%= config.srcDir %>/css/style.css'],
                tasks: ['autoprefixer', 'csslint', 'cssmin']
            },

            html: {
                files: ['<%= config.srcDir %>/**/*.html']
            }

        }

    });

    grunt.registerTask('default', ['watch']);

};