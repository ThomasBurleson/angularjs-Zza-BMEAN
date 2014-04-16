(function( define ) {
    'use strict';

    define( [], function( )
    {
        return  [ 'productService', '$state', '$stateParams', '$log', ProductController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * ProductController provides a view model associated with the `menu.html` view
     * and its `menu.*.html` sub-view templates
     */
    function ProductController( productService, $state, $stateParams, $log )
    {
        $log = $log.getInstance( "ProductController" );

        var type = $stateParams.productType,
            vm  = this;

        vm.products    = [ ];
        vm.template    = null;
        vm.productSref = productSref;
        vm.go          = showProductDetails;

        // Now async load all available products for the requested type (pizza, salad, drink)

        productService.getTemplateURLFor( type )
            .then( function( url )
            {
                vm.template = url;
            });

        productService.loadProductsFor( type )
            .then( function( products )
            {
                vm.products = products;
            })


        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * An ng-click callback that uses $state to navigate
         * the link url is not visible in the browser and must
         * style the anchor tag with 'hand' for the cursor to indicate a clickable.
         * See pizza.html for an example of this approach
         */
        function showProductDetails(product)
        {
            $log.debug( "go( {0} )", [product] );
            $state.go('app.order.product', {productType : product.type, productId: product.id});
        }

        // Generates a link that you can see in the browser
        // See drink.html for an example of this approach
        function productSref(p)
        {
            return "app.order.product({productType: '" + p.type + "', productId: '" + p.id +"'})";
            //return '#/menu/'+p.type+'/'+p.id;
        }
    }

}( window.define ));
