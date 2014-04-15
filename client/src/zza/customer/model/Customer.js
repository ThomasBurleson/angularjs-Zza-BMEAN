(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `Customer` class definition; without the ORM-injected properties...
        return CustomerClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * BreezeJS ORM will use the MetaData to populate properties and values to each instance.
         * We also need to `add` business methods (logic) to the class.
         *
         * @see CustomerService::registerORModels()
         * @see Metadata::addCustomer()
         *
         *    function addCustomer() {
         *        addType({
         *            name: 'Customer',
         *            dataProperties: {
         *                id:        { type: ID },
         *                firstName: { max: 50 },
         *                lastName:  { max: 50 },
         *                phone:     { max: 100 },
         *                email:     { max: 255 },
         *                address:   { complex: 'Address'}
         *            },
         *            navigationProperties: {
         *                orders: {type: 'Order', hasMany: true } // nav in cache; not in Mongo!
         *            }
         *        });
         *    }
         *
         * @returns {Customer}
         * @constructor
         */
        function CustomerClazz( )
        {
            var Customer = function(){ };

                defineProperty( Customer, "fullName", getFullName );

            return Customer;

            // **********************************************************
            // Private Methods
            // **********************************************************

            function getFullName()
            {
                return this.firstName + " " + this.lastName;
            }
        }
    });


}( define ));
