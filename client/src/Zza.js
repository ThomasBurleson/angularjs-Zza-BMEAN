(function ( define ) {
    "use strict";

    define([
              'mindspace/utils/logger/ExternalLogger'
            , 'mindspace/utils/logger/LogDecorator'
            , 'zza/utils/ToastrLogDecorator'

            , 'zza/app/Application'
            , 'zza/menu/Menu'
            , 'zza/order/Order'
            , 'zza/customer/Customer'
            , 'zza/services/Dataservices'
        ],
        function (
              $log
            , LogDecorator
            , ToastrLogDecorator

            , Application
            , Menu
            , Order
            , Customer
            , Dataservices
        ){
            var dependencies = [
                   , "ngSanitize"            // Vendor-defined NG modules...
                   , 'breeze.angular'
                   , 'ui.router'
                   , 'ui.bootstrap'
                   , Application             // Zza-defined NG modules...
                   , Menu
                   , Order
                   , Customer
                   , Dataservices
                ],
                app,
                appName = 'zza.Application',
                onStartup = [ 'config', 'dataservice', initializeDataservices ];
            

            $log = $log.getInstance( "BOOTSTRAP" );
            $log.debug( "Initializing {0}", [ appName ] );

            /**
             * Start the Zza application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            app = angular.module( appName, dependencies)
                         .config( LogDecorator       )
                         .config( ToastrLogDecorator )
                         .run(    onStartup          );

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

            return app;


            // **********************************************************
            // Private Methods
            // **********************************************************

            function initializeDataservices( config, dataservice )
            {
                $log.info( "Zza SPA is loaded and running on " + config.server );

                /**
                 * Trigger initial loading of data from server
                 * The app may appear to be more responsive if loading happens in background
                 * while the app launches on a splash page that doesn't actually need data.
                 */
                dataservice.ready();

                /**
                 * Configure toastr for this app to have a 2 second toast timeout
                 */
                if ( toastr )
                {
                    toastr.options.timeOut       = 2000;
                    toastr.options.positionClass = 'toast-bottom-right';
                }

            }
        }
    );


}( window.define ));
