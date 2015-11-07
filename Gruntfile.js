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
        platforms: ['linux64'],
        buildDir: 'build',
      },
      src: 'public/**/*' // Your node-webkit app
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['jade']);
};