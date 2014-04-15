(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `ProductOption` class definition; without properties...
        return ProductOptionClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::addProductOption()
         *
         *    function addProductOption() {
         *        addType({
         *            name: 'ProductOption',
         *            dataProperties: {
         *                id:             { type: LUID },
         *                type:           { max: 20, null: false },
         *                name:           { max: 50, null: false },
         *                factor:         { max: 255 },
         *                productTypes:   { hasMany: true }
         *            }
         *        });
         *    }
         *
         * @returns {ProductOption}
         * @constructor
         */
        function ProductOptionClazz( )
        {
            var ProductOption = function() {};

                // Implicit accessors

                defineProperty( ProductOption, "isPizzaOption", getIsPizzaOption );
                defineProperty( ProductOption, "isSaladOption", getIsSaladOption );

            return  ProductOption;


            // **********************************************************
            // Private Methods
            // **********************************************************

            function getIsPizzaOption ()
            {
                return this.productTypes ? (this.productTypes.indexOf('pizza') > -1) : false;
            }

            function getIsSaladOption()
            {
                return this.productTypes ? (this.productTypes.indexOf('salad') > -1) : false;
            }
        }
    });

}( define ));
