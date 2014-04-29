(function( define, angular ) {
    "use strict";

    define( [

          'mindspace/logger/ExternalLogger'

        , 'zza/menu/directives/ImageSourceDirective'
        , 'zza/menu/controllers/ProductController'
        , 'zza/menu/services/ProductService'

    ], function(
          logger

        , ImageSourceDirective
        , ProductController
        , ProductService
    ){
        var moduleName   = "zza.Products";

        logger.getInstance("> Products")
              .debug( "Registration of angular.module( `{0}` )",[moduleName]);

        angular.module( moduleName, [ ]  )
            .controller( 'ProductController'  , ProductController       )
            .directive(  'productImgSrc'      , ImageSourceDirective    )
            .factory(    'productService'     , ProductService          );

        return moduleName;

    });

}( window.define, window.angular ));
