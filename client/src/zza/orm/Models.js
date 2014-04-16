(function( define ) {
    "use strict";

    define( [

         'zza/customer/model/Address'
        ,'zza/customer/model/Customer'

        , 'zza/menu/model/Product'
        , 'zza/menu/model/ProductOption'
        , 'zza/menu/model/ProductSize'

        , 'zza/order/model/Order'
        , 'zza/order/model/OrderItem'
        , 'zza/order/model/OrderItemOption'
        , 'zza/order/model/OrderStatus'

    ], function(

          Address
        , Customer

        , Product
        , ProductOption
        , ProductSize

        , Order
        , OrderItem
        , OrderItemOption
        , OrderStatus
        
    ){
        // Register an annotated construction class/function
        return [  'metadata', 'orm', 'util', Models ];


        // **********************************************************
        //  Class
        // **********************************************************

        /**
         * Register with Breeze ORM Class definition; for auto-instantiations
         * with the ORM processes
         */
        function Models( metadata, orm, util )
        {
            var $log = util.$log.getInstance( "Models" );

            $log.debug( "registering custom model classes with BreezeJS..." );

            // Add metadata properties to the store
            metadata.fill( orm.store );

            // Register types with the store
            registerEntities();


            /**
             * Register with Breeze ORM Class definition; for auto-instantiations
             * with the ORM processes
             */
            function registerEntities()
            {
                var registerEntity = orm.store.registerEntityTypeCtor.bind( orm.store);

                $log.debug( "registerEntities()" );

                registerEntity( 'Customer'        , Customer );

                registerEntity( 'Product'         , Product);
                registerEntity( 'ProductOption'   , ProductOption);

                registerEntity( 'OrderItemOption' , OrderItemOption  );
                registerEntity( 'OrderItem'       , OrderItem        );
                registerEntity( 'Order'           , Order            );

                // To easily create child instances, inject special builder methods to the Classes

                Order.prototype.createOrderItem       = makeCreateOrderItem( orm.store.getEntityType('OrderItem')       );
                OrderItem.prototype.createOrderOption = makeCreateOrderOption( orm.store.getEntityType('OrderItemOption') );
                OrderItem.prototype.getEntityById     = util.getEntityByIdFromObj;

            }

        }


        /**
         * Inject
         * @param OrderItemType
         * @returns {createOrderItem}
         */
        function makeCreateOrderItem( OrderItemType )
        {
            return function createOrderItem( product )
            {
                var item = OrderItemType.createInstance();

                item.product = product;
                item.order   = this;

                return item;
            }
        }

        /**
         * Inject builder method
         * @param OrderItemOptionType
         * @returns {createOrderOption}
         */
        function makeCreateOrderOption( OrderItemOptionType )
        {
            return function createOrderOption( productOption )
            {
                var option = OrderItemOptionType.createInstance();

                option.productOption = productOption;
                option.orderItem = this;

                return option;
            }
        }


    });

}( window.define ));
