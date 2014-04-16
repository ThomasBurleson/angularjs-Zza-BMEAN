(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `OrderItemOption` class definition; without properties...
        return OrderItemOptionClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::addOrderItemOption()
         *
         *    function addOrderItemOption() {
         *        addType({
         *            name: 'OrderItemOption',
         *            isComplexType: true,
         *            dataProperties: {
         *                productOptionId: { type: LUID, null: false, default: 0 },
         *                name:            { max: 50, null: false },
         *                quantity:        { type: DT.Int32, null: false, default: 1 },
         *                price:           { type: DECIMAL, null: false, default: 0 }
         *            }
         *        });
         *    }
         *
         * @returns {OrderItemOption}
         * @constructor
         */
        function OrderItemOptionClazz( )
        {
            var OrderItemOption = function(){ };

            return defineProperty( OrderItemOption, "productOption", getProductOption, setProductOption );

            // **********************************************************
            // Private Methods
            // **********************************************************

            function getProductOption()
            {
                var id = this.productOptionId;
                return (id) ? this.productOption = getEntityById(this, 'ProductOption', id) : null;
            }
            function setProductOption(po)
            {
                this.productOptionId = po ? po.id : 0;
                this.name = po ? po.name : '';
            }
        }
    });


}( window.define ));
