(function( require ) {
    "use strict";

    // Development-mode uses RequireJS to load the Class definitions (on-demand)
    // so we need to configure require to know root source path

    require.config ({
        baseUrl : './src',
        paths   :
        {
            // Configure path to `mindspace.utils` module/library [ contains multiple defines(...) ]
            'mindspace.utils' : '../vendor/angular-logDecorator/release/amd/angular-logDecorator'

        },
        bundles: {
            'mindspace.utils': [
                // List external AMDs that are known
                'mindspace/logger/ExternalLogger',
                'mindspace/utils/supplant',
                'mindspace/utils/makeTryCatch'
            ]
        }
    });

}( window.require ));
