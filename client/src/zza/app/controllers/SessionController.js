(function( define ) {
    "use strict";

    define( [ ], function( )
    {

        // Register an annotated construction function
        return [ '$log', SessionController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    function SessionController( $log )
    {
        var vm = this;

        $log = $log.getInstance('SessionController');
        $log.debug( "vm instantiated..." );
    }

}( define ));
