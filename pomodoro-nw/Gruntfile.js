module.exports = function(grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        version: '0.19.3',
        //platforms: ['linux', 'win', 'osx64'],
        //platforms: ['win'],
        platforms: ['osx64', 'win'],
        buildDir: 'build',
      },
      src: 'public/**/*'
    },
  });
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};
