(function( define ) {
    "use strict";

    define( [ ], function( )
    {
        // Register an annotated construction class/function
        return [ 'user', Session ];
    });

    // **********************************************************
    // Session Class
    // **********************************************************

    function Session( user )
    {

        return {

            isReady   : null,       // promise resolves when ORM initialized

            user      : user,       // login user

            customer  : null,       // @see customer/model/Customer

            cartOrder : null,       // @see order/model/Order
            draftOrder: null,       // @see order/model/Order

            lookups   : null        // @see orm/Lookups, @see SessionController
        }

    }

}( define ));
