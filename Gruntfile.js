/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var returnIndex = function(connect) {
        return connect.static('index.html');
    };

    var project = {
        build: './build',
        dist: './dist/public',
        app: './src/app',
        index: "./src/index.html",
        bower: './bower_components'
    };

    var pkg = (require('./package.json'));

    // Configure Grunt
    grunt.initConfig({

        pkg: pkg,
        project: project,

        connect: {
            options: {
                base: ['./src', '<%= project.build%>', '<%= project.app%>', __dirname],
                port: 9000,
                open: true,
            },
            livereload: true
        },

        watch: {
            dev: {
                files: ['<%= project.index%>', '<%= project.app%>/**/*.*'],
                tasks: [
                    'jshint',
                    'less'
                ],
                options: {
                    livereload: true
                }
            }
        },

        less: {
            dist: {
                options: {},
                files: {
                    '<%= project.build%>/styles/main.css': ['<%= project.app%>/**/*.less']
                }
            }
        },

        cssmin: {},

        jshint: {
            dev: [
                '<%= project.app%>/**/*.js',
                'Gruntfile.js'
            ]
        },

        wiredep: {
            app: {
                src: ['<%= project.index%>'],
                ignorePath: /\.\.\//
            },
            style: {
                src: ['<%= project.app%>/app.less']
            },
        },

        clean: {
            dist: ['<%= project.build%>', '<%= project.dist%>'],
            dev: ['<%= project.build%>']
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= project.dist%>/styles/*.css'
            },
            js: {
                src: '<%= project.dist%>/scripts/*.js'
            }
        },

        concat: {
            generated: {
                cwd: 'src'
            }
        },

        copy: {
            index: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%= project.index%>'],
                    dest: '<%= project.dist%>/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    flatten: true,
                    src: ['<%= project.app%>/favicon.ico'],
                    dest: '<%= project.dist%>/',
                    filter: 'isFile'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: false,
                    cwd: '<%= project.build%>',
                    src: ['fonts/**/*'],
                    dest: '<%= project.dist%>/',
                    filter: 'isFile'
                }]
            }
        },

        useminPrepare: {
            html: {
                src: ['<%= project.index%>']
            },
            options: {
                dest: '<%= project.dist%>',
                staging: '<%= project.build%>',
                root: 'src',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        ngtemplates: {
            application: {
                cwd: '<%= project.app%>',
                src: '**/*.html',
                dest: '<%= project.build%>/template.js',
                options: {
                    //prefix: '/',
                    usemin: '<%= project.dist%>/scripts/main.min.js',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [{
                    expand: true,
                    src: ['<%= project.build%>/concat/**/*.js']
                }]
            }
        },

        usemin: {
            html: [
                '<%= project.dist%>/index.html'
            ],
            options: {
                assetsDirs: ['<%= project.dist%>']
            }
        }

    });

    grunt.registerTask('serve', [
        'clean:dev',
        'wiredep:style',
        'less',
        'wiredep:app',
        'connect',
        'watch:dev'
    ]);


    grunt.registerTask('dist', [
        'wiredep:app',
        'wiredep:style',
        'jshint:dev',
        'clean:dist',
        'copy:index',
        'copy:dist',
        'less',
        'useminPrepare',
        'ngtemplates:application',
        'concat:generated',
        'ngAnnotate',
        'cssmin:generated',
        'uglify:generated',
        'filerev:js',
        'filerev:css',
        'usemin'
    ]);

    grunt.registerTask('default', ['dist']);

};
