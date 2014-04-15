(function( define, angular ) {
    "use strict";

    define( [

        'mindspace/utils/logger/ExternalLogger'

        , 'zza/orm/EntityManager'
        , 'zza/orm/Lookups'
        , 'zza/orm/Metadata'
        , 'zza/utils/Utils'

    ], function(
          logger

        , EntityManager
        , Lookups
        , Metadata
        , Utils
    ){
        var moduleName = "zza.Dataservices";

        logger.getInstance("> Dataservice")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ]                   )
               .factory( 'lookups'      , Lookups         )
               .factory( 'metadata'     , Metadata        )
               .factory( 'orm'          , EntityManager   )
               .factory( 'util'         , Utils           );

        return moduleName;
    });

}( define, angular ));
