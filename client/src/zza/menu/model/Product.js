(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `Product` class definition; without properties...
        return ProductClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::addProduct()
         *
         *    function addProduct() {
         *        addType({
         *            name: 'Product',
         *            dataProperties: {
         *                id:             { type: LUID },
         *                type:           { max: 20, null: false },
         *                name:           { max: 50, null: false },
         *                description:    { max: 255 },
         *                image:          { max: 50 }, // image name
         *                hasOptions:     { type: BOOL, null: false },
         *                isPremium:      { type: BOOL, null: false },
         *                isVegetarian:   { type: BOOL, null: false },
         *                withTomatoSauce:{ type: BOOL, null: false },
         *                sizeIds:        { type: LUID, hasMany: true }
         *            }
         *        });
         *    }
         *
         * @returns {Product}
         * @constructor
         */
        function ProductClazz( )
        {
            var Product = function(){ };

            // Define implicit accessors
            defineProperty( Product, "productSizeIds", getProductSizeIds );

            return Product;

            // **********************************************************
            // Private Methods
            // **********************************************************

            function getProductSizeIds ()
            {
                return this.sizeIds || [];
            }
        }
    });


}( define ));
