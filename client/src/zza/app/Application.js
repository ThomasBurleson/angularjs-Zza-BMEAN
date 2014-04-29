(function( define, angular ) {
    "use strict";

    define( [
          'mindspace/logger/ExternalLogger'

        , 'zza/app/routes/RouteManager'
        , 'zza/app/routes/RouteLogger'

        , 'zza/app/model/Configuration'
        , 'zza/app/model/Session'
        , 'zza/app/model/User'

        , 'zza/app/controllers/HeaderController'
        , 'zza/app/controllers/SessionController'
    ],
    function(
          logger

        , RouteManager
        , RouteLogger

        , Configuration
        , Session
        , User

        , HeaderController
        , SessionController
    ){
        var moduleName   = "zza.Routing";

        logger.getInstance("> Application")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ] )
               .factory(    'config'            , Configuration     )
               .factory(    'session'           , Session           )
                .factory(   'user'              , User              )
               .controller( 'SessionController' , SessionController )
               .controller( 'HeaderController'  , HeaderController  )
               .config( RouteManager                                )
               .run(    RouteLogger                                 );


        return moduleName;
    });

}( window.define, window.angular ));
