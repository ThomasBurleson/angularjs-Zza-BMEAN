(function( define ) {
    'use strict';

    define( [], function()
    {
        // Publish annotated Class (construction function)
        return [ '$log', '$rootScope', Configuration ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * Provides configuration values used widely in the app
     * Also configures 'toastr', the pop-up message component
     */
    function Configuration ( $log, $rootScope )
    {
        $log.getInstance("Configuration").debug("Initializing configuration constants...");

        return {
            debug               : true,
            devServiceName      : 'breeze/Dev',
            templates           : {
                menuURL    : './src/zza/menu/tmpl/menu.{0}.html',              // MenuController
                choiceURL  : './src/zza/order/tmpl/orderItemOption{0}.html'    // OptionTypes
            },
            productImageBasePath: './assets/images/products/',
            productUnknownImage : './assets/images/products/unknown.jpg',
            reportStateChanges  : true,
            server              : 'Express',
            serviceName         : 'breeze/zza',
            userSessionId       : '0', //breeze.core.getUuid()
            version             : $rootScope.version = '0.8.0'
        };
    }

}( define ));
