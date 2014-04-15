(function( define ) {
    'use strict';

    define( [], function()
    {
        return  [ '$state', '$stateParams', 'session', 'optionTypes', 'util', OrderItemController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * OrderItemController provides a view model associated with the `orderItem.html` view
     * and its `orderItem**.html` sub-views.
     */
    function OrderItemController( $state, $stateParams, session, optionTypes, util )
    {
        var vm     = this,
            $log   = util.$log.getInstance( "OrderItemController" );

        session.ready( function onReady()
        {
            var cartOrder    = session.cartOrder;
            var draftOrder   = session.draftOrder;
            var lookups      = session.lookups;
            var info         = getOrderItemInfo( );
            var isDraftOrder = false;

            $log.debug( "vm instantiated..." );

            if ( info ) {
                isDraftOrder    = info.orderItem.order === session.draftOrder;
                vm.addToCart    = addToCart;
                vm.isDraftOrder = isDraftOrder;
                vm.orderItem    = info.orderItem;
                vm.product      = info.product;
                vm.sizeVms      = createSizeModels(info);
                vm.typeVms      = optionTypes.createVms( info.orderItem );

            } else {
                showMenu();
            }

            // **********************************************************
            // Private Methods
            // **********************************************************

            function addToCart() {
                $log.debug( "addToCart()" );

                if (isDraftOrder) {
                    draftOrder.removeItem(vm.orderItem);
                    cartOrder.addItem(vm.orderItem);

                    $log.info("Added item to cart");

                    showMenu();
                }
            }

            // Get the OrderItem information base on $stateParams
            function getOrderItemInfo( ) {
                $log.debug( "getOrderItemInfo()" );

                var fromOrder   = $stateParams.orderItemId != null;
                return fromOrder ? getInfoFromOrder() : getInfoByProduct()

                // Get the order item info from the order and orderItem id.
                function getInfoFromOrder( ) {
                    var info = null
                        , orderId = $stateParams.orderId
                        , orderItemIid = +$stateParams.orderItemId;

                    // Todo: in future, could be the orderId of any order
                    var orderItem = (orderId == 'cart')                     ?
                                    cartOrder.getSelectedItem(orderItemIid) :
                                    draftOrder.getSelectedItem(orderItemIid);

                    if (orderItem){
                        info = {
                              orderItem : orderItem
                            , product   : orderItem.product
                            , sizes     : lookups.productSizes.byProduct(orderItem.product)
                        }
                    }
                    return info;
                }

                // Get the order item info from the productId.
                function getInfoByProduct() {
                    var prodId = +$stateParams.productId
                    var product = lookups.products.byId(prodId);
                    if (!product){ return null; }

                    var sizes = lookups.productSizes.byProduct(product);

                    // Find an orderItem on the draft order for the given product.
                    var orderItem =  draftOrder.orderItems.filter(function (oi) {
                        return oi.productId == prodId;
                    })[0];

                    if (!orderItem) {
                        // No existing orderItem for this product
                        // Create a new orderItem
                        orderItem = draftOrder.addNewItem(product);
                        orderItem.productSize = sizes[0]; // defaultSize
                    }

                    return {
                        orderItem: orderItem,
                        product: product,
                        sizes: sizes
                    };
                }
            }

        });



        // **********************************************************
        // Private Methods
        // **********************************************************

        function createSizeModels(info)
        {
            var isPremium = info.product.isPremium;
            return info.sizes.map(function (size)
            {
                return {
                    id      : size.id,
                    name    : size.name,
                    price   : isPremium ? (size.premiumPrice ||size.price) : size.price
                };
            });
        }

        function showMenu(){
            $log.debug( "showMenu()" );

            $state.go('app.menu', {productType : $stateParams.productType});
        }
   }

}( define ));
