(function( define ) {
    "use strict";

    define( [ ], function( )
    {
        // Register an annotated construction class/function
        return [ User ];
    });

    // **********************************************************
    // User Class
    // **********************************************************

    function User ( )
    {
        return {
            email           : null,
            password        : null,
            isAuthenticated : false
        };
    }

}( define ));
