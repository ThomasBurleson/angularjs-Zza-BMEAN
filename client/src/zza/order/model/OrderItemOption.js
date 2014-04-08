(function( define ) {
    'use strict';

    define([], function( )
    {
        // Publish annotated Class
        return [ 'util', 'lookups', OrderItemOption ];
    });

    // **********************************************************
    // Class Factory
    // **********************************************************

    /**
     * Creates viewmodels for every ProductOption available for the product
     * of a given OrderItem.
     *
     * One such vm for each option type (e.g., 'pesto sauce").
     */
    function OrderItemOption( util, lookups )
    {
        return {
            createVms: createVms
        };

        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * Creates an anonymous VM for each productOption for the given product
         * The VM has an itemOption if the current OrderItem has an ItemOption for that product
         */
        function createVms(orderItem)
        {
            var productOptions = lookups.productOptions.byProduct(orderItem.product);

            var itemOptions =
                util.keyArray(orderItem.orderItemOptions, function (o) { return o.productOptionId; });

            return productOptions.map(function (po) {
                var io = itemOptions[po.id];
                return {
                    id: po.id,
                    name: po.name,
                    productOption: po,
                    selected: !!io,
                    itemOption: io
                };
            });
        }
    }


}( window.define));
