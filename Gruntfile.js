module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);

  grunt.initConfig({
    less: {
      options: {
        cleancss: true
      },
      style: {
        files: {
          "css/archive-pile.css": "less/archive-pile.less"
        }
      }
    },
    watch: {
      css: {
        files: [
          'less/config.less',
          'less/arichive-pile.less',
          'less/app/*.less',
          'less/libraries/*.less'
        ],
        tasks: ['less:style'],
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

};