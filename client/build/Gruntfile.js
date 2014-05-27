module.exports = function(grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {

         /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            src: [
                '../assets/js/*.js'
            ],
            options: {
                force: true
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy our project assets
         * (images, fonts, etc.) and javascripts into `buildDir`, and then to copy the assets to `compileDir`.
         */
        copy: {

            prod_boot: {
                files: [
                    {
                        src: './requirejs/bootstrap_prod.js',
                        dest: '../assets/js/boot.js',
                        expand: false
                    }
                ]
            },
            dev_boot: {
                files: [
                    {
                        src: './requirejs/bootstrap_dev.js',
                        dest: '../assets/js/boot.js'
                    },
                    {
                        src: './requirejs/requirejs.config_dev.js',
                        dest: '../assets/js/require.config.js'
                    }
                ]
            }

        },

        /**
         * Minifies RJS files and makes it production ready
         * Build files are minified and encapsulated using RJS Optimizer plugin
         */
        requirejs: {
            compile: {
                options: {
                    preserveLicenseComments: true,
                    optimize: "none"
                }
            },
            compileMin: {
                options: {
                    preserveLicenseComments: false,
                    optimize: "uglify"
                }
            }
        }

    };

    /**
     * Common options for the grunt-requireJS processes
     */
    var commonOptions = {
        baseUrl: "../src",
        paths   :
        {
            // Configure path to `mindspace.utils` module/library [ contains multiple defines(...) ]
            'mindspace.utils' : '../vendor/angular-logX/release/amd/angular-logX'

        },
        bundles: {
            'mindspace.utils': [
                // List external AMDs that are known
                'mindspace/logger/ExternalLogger',
                'mindspace/utils/supplant',
                'mindspace/utils/makeTryCatch'
            ]
        },
        out: '../assets/js/zza.js',
        name: 'Zza'
    };


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize Configuration
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    grunt.util._.extend( taskConfig.requirejs.compile.options   , commonOptions );
    grunt.util._.extend( taskConfig.requirejs.compileMin.options, commonOptions );

    grunt.initConfig( taskConfig );



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Register Tasks
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    grunt.registerTask("dev", [
        'clean:src',
        'copy:dev_boot'         // copy the dev boot.js file (which let's RequireJS dynamically load the AMDs )
    ]);

    grunt.registerTask( "qa", [
        'clean:src',
        "requirejs:compile",    // concatenate and do NOT minify all the Zza source AMDs
        'copy:prod_boot'        // copy the production boot.js file (which does NOT use require.config())
    ]);


    grunt.registerTask( "prod", [
        'clean:src',
        "requirejs:compileMin", // concatenate and minify all the Zza source AMDs
        'copy:prod_boot'        // copy the production boot.js file (which does NOT use require.config())
    ]);



};
