(function( define, angular ) {
    "use strict";

    define( [
              'mindspace/utils/logger/ExternalLogger'
            , 'zza/customer/controllers/CustomerController'
            , 'zza/customer/services/CustomerService'
        ],
        function(
              logger
            , CustomerController
            , CustomerService
        ){
            var moduleName   = "zza.Customer";

            logger.getInstance("> Customer")
                  .debug( "Registration of angular.module( `{0}` )",[moduleName]);

            // Need to preserve Customer state beyond controller's lifetime

            angular.module( moduleName, [ ] )
                .value(      'customer.state'       , {}                 )
                .factory(    'customerService'      , CustomerService    )
                .controller( 'CustomerController'   , CustomerController );


            return moduleName;
        });

}( window.define, window.angular ));
