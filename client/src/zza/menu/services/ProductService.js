(function( define ) {
    'use strict';

    define(
        [
            'zza/menu/model/Product'
          , 'zza/menu/model/ProductOption'
          , 'zza/menu/model/ProductSize'
        ],
        function( Product, ProductOption, ProductSize )
        {

            return [ 'session', 'orm', 'util', ProductService ];

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
            function ProductService( session, orm, util )
            {
                var $log = util.$log.getInstance("ProductService");

                registerORModels();

                // Publish Customers' API

                return {
                    loadProductsFor    : loadAllProductsFor,
                    getTemplateURLFor  : getTemplateURLFor
                };


                // **********************************************************
                // Private Methods
                // **********************************************************

                /**
                 * Register with Breeze ORM Class definition; for auto-instantiations
                 * with the ORM processes
                 */
                function registerORModels()
                {
                    $log.debug( "registerORModels()" );

                    var store        = orm.store,
                        registerType = store.registerEntityTypeCtor.bind(store);

                    registerType('Product'      , Product);
                    registerType('ProductOption', ProductOption);
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
    });

}( window.define ));
