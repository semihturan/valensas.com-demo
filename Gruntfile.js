'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt);

    grunt.loadNpmTasks('grunt-build-control');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.initConfig({
      'gh-pages': {
        options: {
          base: 'dist'
        },
        src: ['**']
      },
      app: {
        app: '',
        dist: 'dist',
        baseurl: ''
      },
      watch: {
          jekyll: {
              files: [
                  '_site/**/*.{html,yml,md,mkd,markdown}'                ],
              tasks: ['jekyll:server']
          },
          livereload: {
              options: {
                  livereload: '<%= connect.options.livereload %>'
              },
              files: [
                  '_site/**/*.{html,yml,md,mkd,markdown}',
                  '_site/css/*.css',
                  '_site/js/*.js',
                  '_site/images/*.{svg,gif,jpg,jpeg,png,svg,webp}'
              ]
          }
      },
      connect: {
          options: {
              port: 4000,
              livereload: 35729,
              // change this to '0.0.0.0' to access the server from outside
              hostname: '0.0.0.0'
          },
          livereload: {
              options: {
                  open: {
                      target: 'http://localhost:4000/<%= app.baseurl %>'
                  },
                  base: [
                      '_site',
                      '.tmp',
                      '<%= app.app %>'
                  ]
              }
          },
          dist: {
              options: {
                  open: {
                      target: 'http://localhost:4000/<%= app.baseurl %>'
                  },
                  base: [
                      '<%= app.dist %>',
                      '.tmp'
                  ]
              }
          }
      },
      clean: {
          server: [
              '_site',
              '.tmp'
          ],
          dist: {
              files: [{
                  dot: true,
                  src: [
                      '.tmp',
                      '<%= app.dist %>/*',
                      '!<%= app.dist %>/.git*'
                  ]
              }]
          }
      },
      jekyll: {
          options: {
              config: '_config.yml',
              src: '<%= app.app %>'
          },
          dist: {
              options: {
                  dest: '<%= app.dist %>',
              }
          },
          server: {
              options: {
                  config: '_config.yml',
                  dest: '_site/<%= app.baseurl %>'
              }
          }
      },
      htmlmin: {
          dist: {
              options: {
                  removeComments: true,
                  collapseWhitespace: true,
                  collapseBooleanAttributes: true,
                  removeAttributeQuotes: true,
                  removeRedundantAttributes: true,
                  removeEmptyAttributes: true,
                  minifyJS: true,
                  minifyCSS: true
              },
              files: [{
                  expand: true,
                  cwd: '<%= app.dist %>',
                  src: '**/*.html',
                  dest: '<%= app.dist %>'
              }]
          },
          server: {
              options: {
                  removeComments: true,
                  collapseWhitespace: true,
                  collapseBooleanAttributes: true,
                  removeAttributeQuotes: true,
                  removeRedundantAttributes: true,
                  removeEmptyAttributes: true,
                  minifyJS: true,
                  minifyCSS: true
              },
              files: [{
                  expand: true,
                  cwd: '_site/',
                  src: '*.html',
                  dest: '_site/'
              }]
          }
      },
      sass: {
          server: {
              options: {
                  sourceMap: true
              },
              files: [{
                  expand: true,
                  cwd: '/css',
                  src: '*.{scss,sass}',
                  dest: '_site/css',
                  ext: '.css'
              }]
          },
          dist: {
              options: {
                  outputStyle: 'compressed'
              },
              files: [{
                  expand: true,
                  cwd: '<%= app.app %>/sass',
                  src: '**/*.{scss,sass}',
                  dest: '<%= app.dist %>/css',
                  ext: '.css'
              }]
          }
      },
      autoprefixer: {
          options: {
              browsers: ['last 3 versions']
          },
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= app.dist %>/css',
                  src: '*.css',
                  dest: '<%= app.dist %>/css'
              }]
          }
      },
      critical: {
          dist: {
              options: {
                  base: './',
                  css: [
                      '.tmp/css/build.css'
                  ],
                  minify: true,
                  width: 320,
                  height: 480
              },
              files: [{
                  expand: true,
                  cwd: '<%= app.dist %>',
                  src: ['**/*.html'],
                  dest: '<%= app.dist %>'
              }]
          }
      },
      cssmin: {
          dist: {
              options: {
                  keepSpecialComments: 0,
                  check: 'gzip'
              },
              files: [{
                  expand: true,
                  cwd: '_site/css',
                  src: ['*.css'],
                  dest: '_site/css'
              }]
          },
          server: {
              options: {
                  keepSpecialComments: 0,
                  check: 'gzip'
              },
              files: [{
                  expand: true,
                  cwd:  '.tmp/<%= app.baseurl %>/css',
                  src: ['.css'],
                  dest: '.tmp/<%= app.baseurl %>/css',
              }]
          }
      },
      imagemin: {
          options: {
              progressive: true
          },
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= app.dist %>/images',
                  src: '*.{jpg,jpeg,png,gif}',
                  dest: '<%= app.dist %>/images'
              }]
          }
      },
      svgmin: {
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= app.dist %>/images',
                  src: '*.svg',
                  dest: '<%= app.dist %>/images'
              }]
          }
      },
      copy: {
          dist: {
              files: [{
                  expand: true,
                  dot: true,
                  cwd: '.tmp',
                  src: [
                      'css/*',
                      'js/*'
                  ],
                  dest: '<%= app.dist %>'
              }]
          }
      },
      buildcontrol: {
        dist: {
          options: {
            dir: '<%= app.dist %>',
            remote: 'semihturan@github.com:semihturan/valensas.com-demo.git',
            branch: 'gh-pages',
            commit: true,
            push: true,
            connectCommits: false
          }
        }
      }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'jekyll:server',
            'sass:server',
            'autoprefixer',
            'cssmin:server',
            'htmlmin:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jekyll:dist',
        // 'imagemin',
        'svgmin',
        'sass:dist',
        'autoprefixer',
        'cssmin:dist',
        // 'critical',
        // 'htmlmin'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'copy',
        'buildcontrol',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
