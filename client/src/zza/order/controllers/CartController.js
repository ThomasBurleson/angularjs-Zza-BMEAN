(function( define ) {
    'use strict';

    define( [], function( )
    {
        return  [ 'session', 'pricing', 'util', CartController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * CartController provides a view model associated with `cart.html` view
     */
    function CartController( session, pricing, util )
    {
        var $log = util.$log.getInstance("CartController");
        var vm   = this;

        vm.hasExtraCost  = false;
        vm.cartOrder     = session.cartOrder;
        vm.draftOrder    = session.draftOrder;
        vm.cartItemState = cartItemState;
        vm.updateCosts   = calculateCosts;
        vm.removeItem    = removeItem;

        calculateCosts();

        $log.debug( "vm instantiated..." );

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

})( window.define );
