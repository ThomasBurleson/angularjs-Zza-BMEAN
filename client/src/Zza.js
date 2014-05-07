(function ( define, angular ) {
    "use strict";

    define([
              'mindspace/logger/ExternalLogger'
            , 'zza/utils/ToastrLogDecorator'

            , 'zza/app/Application'
            , 'zza/customer/Customers'
            , 'zza/menu/Products'
            , 'zza/order/Order'
            , 'zza/orm/ORM'
        ],
        function (
              $log
            , ToastrLogDecorator

            , Application
            , Customers
            , Products
            , Order
            , ORM
        ){
            var dependencies = [
                   , "ngSanitize"            // Vendor-defined NG modules...
                   , "ngAnimate"
                   , 'breeze.angular'
                   , 'ui.router'
                   , 'ui.bootstrap'
                   , 'mindspace.logX'

                   , Application             // Zza-defined NG modules...
                   , Customers
                   , Products
                   , Order
                   , ORM
                ],
                app,
                appName = 'zza.Application',
                onStartup = [ 'config', initializeDataservices ];
            

            $log = $log.getInstance( "BOOTSTRAP" );
            $log.debug( "Initializing {0}", [ appName ] );

            /**
             * Start the Zza application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            app = angular.module( appName, dependencies)
                         .config( ToastrLogDecorator )
                         .run(    onStartup          );

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

            return app;


            // **********************************************************
            // Private Methods
            // **********************************************************

            function initializeDataservices( config )
            {
                $log.info( "Zza SPA is loaded and running on " + config.server );

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


}( window.define, window.angular ));
