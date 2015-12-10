module.exports = function(grunt) {
  grunt.initConfig({
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "public/index.html": ["public/index.jade"]
        }
      }
    },
    nwjs: {
      options: {
        version: '0.12.2',
        // platforms: ['linux', 'win', 'osx'],
        platforms: ['osx'],
        buildDir: 'build',
      },
      src: 'public/**/*'
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['jade', 'nwjs']);
  // grunt.registerTask('default', ['jade']);
};