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
        $log = $log.getInstance('RouteLogger', "color:rgb(100, 151, 100);");

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams)
        {
            $log.debug("$stateChangeStart: from '{0}' -> '{1}'", [ fromState.name, toState.name] );
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error)
        {
            $log.debug("$stateChangeError: from '{0}' -> '{1}', Error = {2}", [ fromState.name, toState.name, error] );
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
        {
            $log.debug("$stateChangeSuccess: from '{0}' -> '{1}', params = {2}", [ fromState.name, toState.name, JSON.stringify(toParams)] );
        });
    }

}( define, JSON ));
