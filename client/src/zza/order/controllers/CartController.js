(function( define ) {
    'use strict';

    define( [], function( supplant )
    {
        return  [ 'dataservice', 'pricing', 'util', '$log', CartController ];

        // **********************************************************
        // Controller Class
        // **********************************************************

        /**
         * CartController provides a view model associated with `cart.html` view
         */
        function CartController( dataservice, pricing, util, $log )
        {
            var vm   = this;
                $log = $log.getInstance("CartController");

            dataservice.ready( function onInitialize()
            {
                vm.hasExtraCost  = false;
                vm.cartItemState = cartItemState;
                vm.cartOrder     = dataservice.cartOrder;
                vm.draftOrder    = dataservice.draftOrder;
                vm.updateCosts   = calculateCosts;
                vm.removeItem    = removeItem;

                calculateCosts();

                $log.debug( "vm instantiated..." );
            });

            // **********************************************************
            // Private Methods
            // **********************************************************

            function calculateCosts()
            {
                var cart = vm.cartOrder;

                $log.debug( "calculateCosts()" );

                vm.hasExtraCost = false;
                vm.haveItems = (cart.orderItems.length > 0);
                if ( vm.haveItems ) {
                    var total = pricing.calcOrderItemsTotal( cart );
                    vm.hasExtraCost = pricing.orderHasExtraCostOptions( cart );
                }
            }

            function cartItemState(item)
            {
                var params = {orderId: 'cart', productType: item.product.type, orderItemId: item.id };
                return 'app.order.item('+JSON.stringify(params)+')';
                //return '#/order/cart/'+item.product.type+'/'+item.id;
            }

            function removeItem( item )
            {
                $log.info( util.supplant("Remove item ( product={product.type}, id={id} )", item ) );

                //don't need to remove if item is an entity (e.g, SQL version)
                vm.cartOrder.removeItem(item);
                vm.draftOrder.addItem(item);

                calculateCosts();
            }
        }
    });


})( define );
