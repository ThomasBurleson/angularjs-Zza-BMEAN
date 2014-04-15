(function( define ) {
    'use strict';

    define(
        [
            'zza/order/model/Order'
          , 'zza/order/model/OrderItem'
          , 'zza/order/model/OrderItemOption'
          , 'zza/order/model/OrderStatus'
          , 'zza/order/model/OptionTypes'

        ],
        function( Order, OrderItem, OrderItemOption, OrderStatus, OptionTypes )
    {

        return [ 'session', 'orm', 'util', OrderService ];

        // **********************************************************
        // Class
        // **********************************************************

        /**
         * OrderService provides a delegate layer with all
         * and its `customer.*.html` sub-view templates
         */
        function OrderService( session, orm, util )
        {
            var $log   = util.$log.getInstance( "OrderService");

            registerORModels();

            // Publish Orders' API

            return {

                createOrder  : createOrderInstance,
                loadOrders   : loadCustomerOrders,
                saveOrder    : saveOrderChanges
            };


            // **********************************************************
            // Private Methods
            // **********************************************************

            /**
             * Create an instance of an Order object...
             */
            function createOrderInstance()
            {
                var params = buildInitializer( session.lookups );
                var order  = orm.getManager().createEntity( 'Order', params );

                return util.$q.when( order );

                /**
                 * Extract the enumerator for order status == `Pending`. And then build
                 * an initializer for the Order instance...
                 *
                 * @param data for fetchLookups()
                 * @returns {{id: *, ordered: Date, delivered: Date}}
                 */
                function buildInitializer( data )
                {
                    return {
                        id          : orm.getNextID(),
                        ordered     : new Date(),
                        orderStatus : data.OrderStatus.Pending,
                        delivered   : new Date()
                    };
                }
            }


            /**
             * Save the specified order...
             *
             * @param order
             * @returns {Promise}
             */
            function saveOrderChanges( )
            {
                $log.debug( "saveOrder()" );

                return orm.getManager()
                          .saveChanges()
                          .then( saveSucceeded, saveFailed );

                // Internal Methods

                function saveSucceeded(saveResult)
                {
                    $log.success("# of entities saved = " + saveResult.entities.length);
                    $log.log( saveResult );

                    return saveSucceeded;
                }

                function saveFailed(error)
                {
                    var msg = 'Save failed: ' + getSaveErrorMessages(error);
                    error.message = msg;

                    $log.error(error, msg);
                    // DEMO ONLY: discard all pending changes
                    // Let them see the error for a second before rejecting changes
                    util.$timeout(function() {
                        manager.rejectChanges();
                    }, 1000);
                    throw error; // so caller can see it
                }
            }

            /**
             * Load all the orders for the specified customer...
             * @see CustomerService::getOrdersForCustomer() which loads summary info ONLY!
             *
             * @param customer
             */
            function loadCustomerOrders( customer )
            {
                $log.debug( "loadCustomerOrders()" );
                return util.$q.reject( "loadAllOrders() has not yet been implemented!" );
            }


            // **********************************************************
            // Internal Methods
            // **********************************************************


            /**
             * Register with Breeze ORM Class definition; for auto-instantiations
             * with the ORM processes
             */
            function registerORModels()
            {
                $log.debug( "registerORModels()" );

                var registerType = store.registerEntityTypeCtor.bind(store);

                registerType( 'Order'            , Order            );
                registerType( 'OrderItem'        , OrderItem        );
                registerType( 'OrderItemOption'  , OrderItemOption  );


                // To easily create child instances, inject special builder methods to the Classes

                Order.prototype.createOrderItem       = makeCreateOrderItem( store.getEntityType('OrderItem')       );

                OrderItem.prototype.createOrderOption = makeCreateOrderOption( store.getEntityType('OrderItemOption') );
                OrderItem.prototype.getEntityById     = util.getEntityByIdFromObj;

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


            function getSaveErrorMessages(error)
            {
                var msg = error.message;
                var detail = error.detail;

                if (msg.match(/validation error/i)) {
                    return getValidationMessages(error);
                } else if (detail && detail.ExceptionType &&
                    detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                    // Concurrency error
                    return "Another user, perhaps the server, " +
                        "may have changed or deleted an entity in the change-set.";
                }
                return msg;
            }

            function getValidationMessages(error)
            {
                var detail = error.detail;

                if (detail) { // Failed validation on the server
                    try {
                        return 'Server ' + detail.ExceptionMessage + '\nStackTrace: ' + detail.StackTrace;
                    } catch (e) {
                        return 'Server ' + error.message;
                    }
                }

                // Failed on client during pre-Save validation
                try {
                    return error.entitiesWithErrors.map(function (entity) {
                        return entity.entityAspect.getValidationErrors().map(function (valError) {
                            return valError.errorMessage;
                        }).join(', \n');
                    }).join('; \n');
                }
                catch (e) {
                    return "validation error (error parsing exception :'" + e.message + "')";
                }
            }

        }
    });

}( window.define ));
