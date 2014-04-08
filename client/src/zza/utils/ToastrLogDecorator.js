(function ( define, toastr ){
    "use strict";

    var supplant;

    /**
     * Register the class with RequireJS.
     */
    define( [ 'utils/supplant' ], function ( supplantFn )
    {
        supplant = supplantFn;

        return [ "$provide", function ($provide)
        {
            // Register our $log decorator with AngularJS $provider
            $provide.decorator('$log', ["$delegate", ToastrLogDecorator ]);
        }];
    });

    // **********************************************************
    // Decorator Class
    // **********************************************************

    /**
     * Decorate the enhanced $log with Toastr UI logging
     *
     * @param {object} $provide The log console.
     * @returns {object} promise.
     * @private
     */
    function ToastrLogDecorator( $delegate )
    {
        var getInstanceFn = $delegate.getInstance;
        if ( !getInstanceFn ) throw new Error( "$log.getInstance() is not available!");

        /**
         * Inject interceptors to output to the `toastr` UI logger first...
         */
        $delegate.getInstance = function( className, colorCSS )
        {
            var instance = getInstanceFn.apply(null, [ className , colorCSS ]),
                logger   = {
                    info : instance.info,
                    error: instance.error,
                    warn : instance.warn
                };

            // Add interceptors
            instance.info    = buildHandler( logger, "info"    );
            instance.error   = buildHandler( logger, "error"   );
            instance.warn    = buildHandler( logger, "warn"    );
            instance.success = buildHandler( logger, "success" );

            return instance;
        }

        return $delegate;
    }


    // **********************************************************
    // Private Methods
    // **********************************************************

    /**
     * Build a logger method interceptor
     *
     */
    function buildHandler( logger, method )
    {
        return function (message, title)
        {
            switch( method )
            {
                case "error":
                    toastr.error( message, title );
                    logger.error.apply(null, toArray(arguments));
                    break;

                case "warn":
                    toastr.warning( message, title );
                    logger.warn.apply(null, toArray(arguments));
                    break;

                case "info":
                default    :
                    toastr.info( message, title );
                    logger.info.apply(null, toArray(arguments));
                    break;
            }
        };
    }

    /**
     * Special argument convertor will remove the `title` argument
     * @param parameters
     * @returns {Array}
     */
    function toArray( parameters )
    {
        var args = Array.prototype.slice.call( parameters );
        // Remove the `title` argument
        if ( args.length > 1 ) {
            args.splice(1,1);
        }
        return args;
    }

})( window.define, window.toastr );
