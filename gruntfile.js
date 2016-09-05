module.exports = grunt => {

    require('load-grunt-tasks')(grunt);
 
    grunt.initConfig({
        connect: {
            options: {
                port: 8888,
                useAvailablePort: true,
                hostname: 'localhost'
            },

            server: {
                options: {
                    livereload: true
                }
            },
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '*.html',
                    'js/*.js',
                    'js/*.json',
                    'js/**/*.js',
                ]
            },
            scripts: {
                files: ['js/*.js', 'js/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                }
            }
        },
        concat: {
            options: {
                seperator: ';',
            },
            dist: {
                src: ['js/*.js', 'js/**/*.js'],
                dest: 'dest/concat.min.js',
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                'dest/uglified.min.js': ['js/*.js', 'js/**/*.js']
                }
            }
        }
    });
    grunt.registerTask('default', []);
    grunt.registerTask('serve', ['concat', 'connect', 'watch']);
};