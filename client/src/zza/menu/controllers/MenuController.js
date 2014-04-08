(function( define ) {
    'use strict';

    define( [], function( )
    {
        return  [ '$state', '$stateParams', '$log', 'util', 'config', 'dataservice', MenuController ];

        // **********************************************************
        // Controller Class
        // **********************************************************

        /**
         * MenuController provides a view model associated with the `menu.html` view
         * and its `menu.*.html` sub-view templates
         */
        function MenuController( $state, $stateParams, $log, util, config, dataservice )
        {
            var vm  = this;

            $log = $log.getInstance("HeaderController");

            dataservice.ready(function onInitialize()
            {
                var type = $stateParams.productType;
                if (type){
                    var types = ['drink', 'pizza', 'salad'];
                    type = types[types.indexOf(type.toLowerCase())];
                }
                type = type || 'pizza';

                vm.go          = go;
                vm.template    = util.supplant( config.templates.menuURL, [ type ] );
                vm.products    = dataservice.lookups.products.byTag( type );
                vm.productSref = productSref;

                $log.debug( "vm instantiated..." );
            });

            // **********************************************************
            // Private Methods
            // **********************************************************

            /**
             * An ng-click callback that uses $state to navigate
             * the link url is not visible in the browser and must
             * style the anchor tag with 'hand' for the cursor to indicate a clickable.
             * See pizza.html for an example of this approach
             */
            function go(product) {
                $log.debug( "go( {0} )", [product] );

                $state.go('app.order.product', {productType : product.type, productId: product.id});
            }

            // Generates a link that you can see in the browser
            // See drink.html for an example of this approach
            function productSref(p) {
                return "app.order.product({productType: '" + p.type + "', productId: '" + p.id +"'})";
                //return '#/menu/'+p.type+'/'+p.id;
            }
        }
    });

}( window.define ));
