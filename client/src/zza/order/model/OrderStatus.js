(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `OrderStatus` class definition; without properties...
        return OrderStatusClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::addOrderStatus()
         *
         *    function addOrderStatus() {
         *        addType({
         *            name: 'OrderStatus',
         *            dataProperties: {
         *                id:   { type: LUID },
         *                name: { max: 50, null: false }
         *            }
         *        });
         *    }
         *
         * @returns {OrderStatus}
         * @constructor
         */
        function OrderStatusClazz( )
        {
            var OrderStatus = function(){ };

            return OrderStatus;

            // **********************************************************
            // Private Methods
            // **********************************************************

        }
    });


}( define ));
