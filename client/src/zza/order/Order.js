(function( define, angular ) {
    "use strict";

    define( [
          'mindspace/utils/logger/ExternalLogger'

        , 'zza/orm/ORM'

        , 'zza/order/services/OrderService'
        , 'zza/order/controllers/CartController'
        , 'zza/order/controllers/OrderItemController'
        , 'zza/order/controllers/SidebarController'

        , 'zza/order/model/OrderItemOption'
        , 'zza/order/model/OrderItemOptionTypes'
        , 'zza/order/model/PriceCalculator'
    ],
    function(
          logger

        , ORM

        , OrderService
        , CartController
        , OrderItemController
        , SidebarController

        , OrderItemOption
        , OrderItemOptionTypes
        , PriceCalculator
    ){
        var moduleName = "zza.Order";

        logger.getInstance("> Order")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ORM ])
               .controller( 'CartController'        , CartController        )
               .controller( 'OrderItemController'   , OrderItemController   )
               .controller( 'SidebarController'     , SidebarController     )
               .factory(    'orderService'          , OrderService          )
               .factory(    'orderItemOption'       , OrderItemOption       )
               .factory(    'orderItemOptionTypes'  , OrderItemOptionTypes  )
               .factory(    'pricing'               , PriceCalculator       );

        return moduleName;
    });

}( define, angular ));
