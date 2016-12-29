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
        version: '0.19.3',
        //platforms: ['linux', 'win', 'osx'],
        platforms: ['win'],
        //platforms: ['osx'],
        buildDir: 'build',
      },
      src: 'public/**/*'
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-nw-builder');
  //grunt.registerTask('default', ['jade']);
  grunt.registerTask('default', ['jade', 'nwjs']);
};
