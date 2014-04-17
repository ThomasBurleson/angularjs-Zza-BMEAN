(function( define, angular ) {
    "use strict";

    define( [
          'mindspace/utils/logger/ExternalLogger'

        , 'zza/orm/ORM'

        , 'zza/order/services/OrderService'
        , 'zza/order/services/OptionGroupsService'
        , 'zza/order/services/PriceCalculator'

        , 'zza/order/controllers/CartController'
        , 'zza/order/controllers/OrderItemController'
        , 'zza/order/controllers/SidebarController'

        , 'zza/order/model/Order'
        , 'zza/order/model/OrderItem'
        , 'zza/order/model/OrderItemOption'
        , 'zza/order/model/OrderStatus'
    ],
    function(
          logger

        , ORM

        , OrderService
        , OptionGroupsService
        , PriceCalculator

        , CartController
        , OrderItemController
        , SidebarController

        , Order
        , OrderItem
        , OrderItemOption
        , OrderStatus
    ){
        var moduleName = "zza.Order";

        logger.getInstance("> Order")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ORM ])

               .controller( 'CartController'        , CartController        )
               .controller( 'OrderItemController'   , OrderItemController   )
               .controller( 'SidebarController'     , SidebarController     )

               .factory(    'orderService'          , OrderService          )
               .factory(    'optionGroupsService'   , OptionGroupsService   )
               .factory(    'pricing'               , PriceCalculator       );

        return moduleName;
    });

}( window.define, window.angular ));
