(function( define, angular ) {
    "use strict";

    define( [

          'mindspace/utils/logger/ExternalLogger'

        , 'zza/menu/controllers/MenuController'
        , 'zza/menu/directives/ImageSourceDirective'

    ], function(
          logger

        , MenuController
        , ImageSourceDirective
    ){
        var moduleName   = "zza.Menu";

        logger.getInstance("> Menu")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ]  )
            .directive(  'productImgSrc'    , ImageSourceDirective )
            .controller( 'MenuController'   , MenuController       );

        return moduleName;

    });

}( define, angular ));
