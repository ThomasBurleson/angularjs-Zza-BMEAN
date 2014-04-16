(function( define ) {
    "use strict";

    define( [ ], function( )
    {
        // Register an annotated construction function
        return [ 'session', 'productService', 'orderService', 'util', SessionController ];
    });

    // **********************************************************
    // Controller Class
    // **********************************************************

    /**
     * Initialize the session instance with order instances and lookup data
     * @constructor
     */
    function SessionController( session, productService, orderService, util)
    {
        var vm  = this,
            dfd = util.$q.defer(),
            $log = util.$log.getInstance('SessionController');

        $log.debug( "initializing the session state..." );

        startLoading().then(  loadLookups   )
                      .then(  loadCarts     )
                      .catch( stopLoading   );

        // **********************************************************
        // Private Methods
        // **********************************************************


        /**
         * Prepare promise for routing `resolving`
         */
        function startLoading()
        {
            $log.debug( "startLoading()" );
            session.isReady = dfd.promise;

            return util.$q.when( true );
        }

        /**
         * Resolve or reject the pending `session` promise
         * @param fault
         */
        function stopLoading( fault )
        {
            $log.debug( "stopLoading()" );

            if ( !fault ) dfd.resolve( session );
            else          dfd.reject( fault    );
        }


        /**
         * Load the Product lookups, filters, and enumerators
         * @returns {Promise}
         */
        function loadLookups()
        {
            $log.debug( "loading Product lookups..." );

            return productService.loadLookups()
                          .then( function( data )
                          {
                              $log.debug( "session.lookups updated." );

                              session.lookups = data;
                              return data;
                          });
        }

        /**
         * Build order instances for the `draft` and `cart` orders
         *
         * @returns {Promise}
         */
        function loadCarts()
        {
            $log.debug( "building draft and cart orders..." );

            return createOrder()
                     .then( function( order )
                     {
                         $log.debug( "session.draftOrder updated." );
                         session.draftOrder = order;
                     })
                     .then( createOrder )
                     .then( function( order )
                     {
                         $log.debug( "session.cartOrder updated." );
                         session.cartOrder = order;
                     })
                     .then( stopLoading );

            function createOrder()
            {
                return orderService.createOrder();
            }
        }
    }

}( window.define ));
