(function( define ) {
    'use strict';

    define([], function( )
    {
        return [ 'session', 'lookups', 'util', ProductService ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * ProductService provides a delegate layer with all
     * and its `customer.*.html` sub-view templates
     *
     * NOTE: that Product and related information is actually loaded `en-mass`
     *       via a "lookups" query and then filtered as needed
     */
    function ProductService( session, lookups, util )
    {
        var $log = util.$log.getInstance("ProductService");


        // Publish Customers' API

        return {
            loadLookups        : loadAllLookups,
            loadProductsFor    : loadAllProductsFor,
            getTemplateURLFor  : getTemplateURLFor
        };


        // **********************************************************
        // Private Methods
        // **********************************************************


        /**
         * Load all Product lookups (options, types, etc)
         * @returns {Promise}
         */
        function loadAllLookups()
        {
            return lookups.fetchLookups();
        }

        /**
         * Get a list of all known Products of `type`
         * @returns Promise
         */
        function loadAllProductsFor( type )
        {
            $log.debug( "loadAllProductsFor( `{0}` )", [type] );

            var items = session.lookups.products.byTag( validatedType(type) );
            return util.$q.when( items );
        }

        /**
         * Based on product type, get the url for the Product *.html Templates
         *
         * @param String
         * @returns Promise
         */
        function getTemplateURLFor( type )
        {
            $log.debug( "getTemplateURLFor( `{0}` )", [type] );

            var templateURL = util.supplant( util.config.templates.menuURL, [ validatedType(type) ] );

            return util.$q.when( templateURL );
        }


        function validatedType( type )
        {
            var types = ['drink', 'pizza', 'salad'];

            if (type) {
                type = types[ types.indexOf( type.toLowerCase() ) ];
            }
            type = type || 'pizza';

            $log.debug( "validatedType() => `{0}` ", [type] );

            return type;
        }
    }


}( window.define ));
