(function( define, JSON ) {
    "use strict";

    define( [ ], function( )
    {
        return [ '$rootScope', '$log', RouteLogger ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * Report to console when UI-Router state changes
     */
    function RouteLogger( $rootScope, $log )
    {
        // Colorize logging output for UI-Routing...
        $log = $log.getInstance('RouteLogger', "color:rgb(100, 151, 100);");


        $rootScope.$on('$stateChangeStart'  , onEventListener );
        $rootScope.$on('$stateChangeError'  , onEventListener );
        $rootScope.$on('$stateChangeSuccess', onEventListener );

        /**
         * Shared event handler for ui-router $state events
         */
        function onEventListener( event, toState, toParams, fromState, fromParams,  error )
        {
            var args = [ event.name, fromState.name, toState.name];

            switch( event.name )
            {
                case '$stateChangeStart'   :
                    $log.debug("{0}: from '{1}' -> '{2}'"               , args );                                      break;

                case '$stateChangeError'   :
                    $log.debug("{0}: from '{1}' -> '{2}', Error = {3}"  , args.concat([ error ]));                     break;

                case '$stateChangeSuccess' :
                    $log.debug("{0}: from '{1}' -> '{2}', params = {3}" , args.concat([ JSON.stringify(toParams) ]));  break;
            }
        }
    }


}( window.define, window.JSON ));
