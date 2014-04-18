(function( define ) {
    'use strict';

    define( [], function()
    {
        return  [ 'session', 'util', '$scope', '$location', SidebarController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * SidebarController provides a view model associated with the `orderSidebar.html` view
     * This view appears as a navigation panel on the left in Order and Menu views
     */
    function SidebarController( session, util, $scope, $location  )
    {
        var $log = util.$log.getInstance("SidebarController");
        var vm   = this;

            vm.cartItemStateRef   = cartItemStateRef;
            vm.cartOrder          = session.cartOrder;
            vm.draftItemStateRef  = draftItemStateRef;
            vm.draftOrder         = session.draftOrder;
            vm.isSelected         = isSelected;
            vm.menuStates         = getMenuStates();
            vm.showRecentlyViewed = false;
            vm.showOrderSummary   = false;

        $log.debug( "vm instantiated..." );

        watchActivityStatus();


        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * Watch for changes in EITHER the draft or cart Orders
         */
        function watchActivityStatus()
        {
            var statusTmpl = "recent={cartOrder.orderItems.length},order={draftOrder.orderItems.length}",
                unwatch    = $scope.$watch( function ()
                             {
                                // publish unique status `state`
                                return util.supplant( statusTmpl, vm );

                             }, updateShowFlags );

            $scope.$on( "$destroy", unwatch );

        }

        /**
         * Update flags to hide/show the draft or cart orders
         */
        function updateShowFlags()
        {
            vm.showRecentlyViewed = (0 < vm.draftOrder.orderItems.length);
            vm.showOrderSummary   = (0 < vm.cartOrder.orderItems.length);
        }

        function cartItemStateRef(item){
            return getItemStateRef('cart', item)
        }

        function draftItemStateRef(item){
            return getItemStateRef('draft', item)
        }

        function getItemStateRef(orderId, item){
            var params = {orderId: orderId, productType: item.product.type, orderItemId: item.id };
            return 'app.order.item('+JSON.stringify(params)+')';
        }

        function getMenuStates(){
            var menus = [
                { name: 'Pizza',  tag: 'pizza'},
                { name: 'Salad',  tag: 'salad'},
                { name: 'Drinks', tag: 'drink'}
            ];
            return menus.map(function(s){
                return {
                    name: s.name,
                    sref: "app.order.products({productType: '"+ s.tag + "'})",
                    tag: s.tag
                }
            });
        }

        function isSelected( state ){
            var path = $location.path().toLowerCase();
            if (path === '/product/') {path = path+'pizza';}
            return -1 < path.indexOf(state.tag);
        }
    }

}( window.define ));
