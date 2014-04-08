(function( define, angular ) {
    "use strict";

    define( [

        'mindspace/utils/logger/ExternalLogger'

        , 'zza/services/ServiceManager'
        , 'zza/services/EntityManager'
        , 'zza/services/Lookups'
        , 'zza/services/Metadata'
        , 'zza/services/Models'
        , 'zza/utils/Utils'

    ], function(
          logger

        , ServiceManager
        , EntityManager
        , Lookups
        , Metadata
        , Models
        , Utils
    ){
        var moduleName = "zza.Dataservices";

        logger.getInstance("> Dataservice")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ]                   )
               .factory( 'dataservice'  , ServiceManager  )
               .factory( 'EntityManager', EntityManager   )
               .factory( 'lookups'      , Lookups         )
               .factory( 'metadata'     , Metadata        )
               .factory( 'model'        , Models          )
               .factory( 'util'         , Utils           );

        return moduleName;
    });

}( define, angular ));
