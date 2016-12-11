/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    propertiesToJSON: {
        main: {
            src: ['/Users/andreafeccomandi/git/bibisco/bibisco/app/resources/*.properties']
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-properties-to-json');

  // Default task.
  grunt.registerTask('default', ['propertiesToJSON']);

};
