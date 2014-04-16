(function( define ) {
    'use strict';

    define( [], function()
    {
        return [ '$log', '$location', HeaderController];
    });

// **********************************************************
    // Class
    // **********************************************************

    /**
     * header viewmodel associated with the header.html view
     * at the top of the shell.
     * It displays navigation among the main app 'pages'
     */
    function HeaderController( $log, $location )
    {
        var vm   = this;
        $log = $log.getInstance("HeaderController");

        $log.debug( "vm instantiated..." );

        vm.homeSref    = 'app.welcome';
        vm.cartSref    = 'app.order.cart';
        vm.isSelected  = isSelected;
        vm.states      = [
            { name: 'Home'     , sref: 'app.welcome'                       , roots: ['/welcome']        }
            ,{ name: 'Order'    , sref: 'app.menu({productType: \'pizza\'})', roots: ['/order','/menu']  }
            ,{ name: 'Customer' , sref: 'app.customer'                      , roots: ['/customer']       }
            ,{ name: 'About'    , sref: 'app.about'                         , roots: ['/about']          }
        ];

        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * Clear all state selections and highlight the user-selected state
         */
        function isSelected( state )
        {
            var path          = $location.path().toLowerCase() || '/welcome',
                roots         = state.roots || [ ],
                matchesPath   = function( element )
                {
                    return ( -1 < path.indexOf(element) );
                };

            return roots.some( matchesPath );
        }
    }

}( window.define  ));
