(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `Address` class definition; without properties...
        return AddressClazz();
    });

    // **********************************************************
    //  Class Builder
    // **********************************************************

    /**
     * While BreezeJS will use the MetaData populate properties and values to each instance
     * we need to `add` business methods (logic) to the class.
     *
     * @see Metadata::addAddress()
     *
     *    function addAddress() {
         *        addType({
         *            name: 'Address',
         *            isComplexType: true,
         *            dataProperties: {
         *                street: { max: 100 },
         *                city:   { max: 100 },
         *                state:  { max: 2 },
         *                zip:    { max: 10 }
         *            }
         *        });
         *    }
     *
     * @returns {Address}
     * @constructor
     */
    function AddressClazz( )
    {
        var Address = function(){ };

        return Address;

        // **********************************************************
        // Private Methods
        // **********************************************************

    }

}( window.define ));
