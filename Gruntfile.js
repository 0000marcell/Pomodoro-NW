module.exports = function(grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        version: '0.20.0',
        //platforms: ['linux', 'win', 'osx64'],
        //platforms: ['osx64'],
        platforms: ['osx64', 'linux'],
        buildDir: 'build',
      },
      src: 'public/**/*'
    },
  });
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};
