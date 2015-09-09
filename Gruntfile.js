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
        platforms: ['osx'],
        buildDir: 'build',
      },
      src: 'public/**/*' // Your node-webkit app
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['jade', 'nwjs']);
};