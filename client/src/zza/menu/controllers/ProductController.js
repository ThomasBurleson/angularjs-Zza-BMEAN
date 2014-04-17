(function( define ) {
    'use strict';

    define( [], function( )
    {
        return  [ 'productService', 'util', '$state', '$stateParams', ProductController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * ProductController provides a view model associated with the `menu.html` view
     * and its `menu.*.html` sub-view templates
     */
    function ProductController( productService, util, $state, $stateParams )
    {
        var $log = util.$log.getInstance( "ProductController" );

        var type = $stateParams.productType,
            vm  = this;

            vm.products    = [ ];
            vm.productSref = productSref;
            vm.templateURL = getTemplateURLFor( type )
            vm.showDetails = showProductDetails;

        // Now async load all available products for the requested type (pizza, salad, drink)

        productService.loadProductsFor( type )
            .then( function( products )
            {
                vm.products = products;
            })

        $log.debug( "vm instantiated." );

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
            $log.debug( "showProductDetails( {type} = {id} )", product );
            $state.go('app.order.products.item', {productType : product.type, productId: product.id});
        }

        // Generates a link that you can see in the browser
        // See drink.html for an example of this approach
        function productSref(p)
        {
            return "app.order.products.item({productType: '" + p.type + "', productId: '" + p.id +"'})";
            //return '#/menu/'+p.type+'/'+p.id;
        }

        /**
         * Based on product type, get the url for the Product *.html Templates
         *
         * @param String
         * @returns Promise
         */
        function getTemplateURLFor( type )
        {
            type = productService.validateType(type);

            $log.debug( "getTemplateURLFor( `{0}` )", [type] );

            return util.supplant( util.config.templates.menuURL, [ type ] );
        }

    }

}( window.define ));
