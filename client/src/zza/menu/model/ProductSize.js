(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `ProductSize` class definition; without properties...
        return ProductSizeClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::addProductSize()
         *
         *    function addProductSize()
         *    {
         *        addType({
         *            name: 'ProductSize',
         *            dataProperties: {
         *                id:           { type: LUID },
         *                type:         { max: 20, null: false },
         *                name:         { max: 50, null: false },
         *                price:        { type: DECIMAL, null: false, default: 0 },
         *                premiumPrice: { type: DECIMAL },
         *                toppingPrice: { type: DECIMAL },
         *                isGlutenFree: { type: BOOL }
         *            }
         *        });
         *    }
         *
         * @returns {ProductSize}
         * @constructor
         */
        function ProductSizeClazz( )
        {
            var ProductSize = function() {};


            return  ProductSize;


            // **********************************************************
            // Private Methods
            // **********************************************************

        }
    });

}( define ));
