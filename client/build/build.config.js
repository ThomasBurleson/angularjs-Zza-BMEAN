/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    devDir      : "../",
    buildDir    : "../",

    appFiles: {

        js: [
            "../src/**/*.js"
        ],

        html: [
            "../index.html"
        ],

        css : [
              "../assets/css/bootstrap.min.css"
            , "../assets/css/bootstrap-responsive.min.css"
            , "../vendor/toastr/toastr.css"
            , "../assets/css/styles.css"
            , "../assets/css/animations.css"
        ]
    },

    /**
     * The compiled HTML template JavaScript file as well as the name of the template angular module.
     */
    htmlTemplateName: "HTMLTemplateModule",

    /**
     * This is the same as `appFiles`, except it contains patterns that reference vendor code (`vendor/`) that we
     * need to place into the build process somewhere. While the `appFiles` property ensures all standardized files
     * are collected for compilation, it is the user's job to ensure non-standardized (i.e. vendor-related) files are
     * handled appropriately in `vendorFiles.js`.
     *
     * The `vendorFiles.js` property holds files to be automatically concatenated and minified with our project source
     * files.
     *
     * The `vendorFiles.css` property holds any CSS files to be automatically included in our app.
     */
    vendorFiles: {
        js: [
            "../vendor/angular/angular.js",
            "../vendor/angular-route/angular-route.js",
            "../vendor/angular-sanitize/angular-sanitize.js",
            "../vendor/headjs-notify/src/load.js",
            "../vendor/require/require.js",
            "../vendor/requirejs-text/text.js",
            "../vendor/underscore.js",
            "../vendor/highlightjs/highlight.pack.js"
        ],
        css: [
        ]
    }


};
