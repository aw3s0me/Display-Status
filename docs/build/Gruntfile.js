module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'gh-pages': {
      options: {
        base: 'html'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');
};
