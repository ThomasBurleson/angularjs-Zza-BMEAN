(function( define ) {
    'use strict';

    define([],function()
    {
        // Publish annotated Class
        return [ 'orm', 'util', Lookups ];
    });

    // **********************************************************
    // Lookup Class
    // **********************************************************

    /**
     *  Extends the ORM with easy access to "Lookups"
     *  which it fetches from the server.
     *
     *  "Lookups" are relatively-stable reference entities
     *  typically presented as choices for property values of primary entities.
     *
     *  e.g. Products, ProductOptions, ProductSizes
     */
    function Lookups( orm, util )
    {
        var $log = util.$log.getInstance( 'Lookups' );

        var lookups     = null,
            query       = null,
            manager     = orm.getManager();

        // Publish API with single feature!

        return {
            fetchLookups : fetchAll
        };

        // **********************************************************
        // Private Methods
        // **********************************************************


        function fetchAll()
        {
            $log.debug( "queryForLookups()" );

            return !lookups ? (query || queryForLookups()) : util.$q.when( lookups );
        }


        /**
         * Using the EntityManager to query and load the Lookup table
         *
         * @returns {Promise}
         */
        function queryForLookups()
        {
            return query = orm.loadLookups()
                                .then(
                                function () {
                                    $log.info( "Lookups loaded from server." );
                                    return lookups = extendService( );
                                },
                                function (error) {
                                    logger.error(error.message, "lookups initialization failed");
                                    logger.error("Alert: Is your MongoDB server running ?");

                                    // so downstream fail handlers hear it too
                                    throw error;
                                }
            );
        }

        /**
         * Load service lookups from  lookup data in cache
         * @param service
         * @param manager
         */
        function extendService( lookups )
        {
            $log.debug( "extendService()" );

            var l = lookups || { };

            l.OrderStatus               = buildOrderStatus( manager );

            l.products                  = manager.getEntities('Product');
            l.products.byId             = filterById(l.products);
            l.products.byName           = filterByName(l.products);
            l.products.byTag            = filterProductsByTag(l.products);

            l.productSizes              = manager.getEntities('ProductSize');
            l.productSizes.byId         = filterById(l.productSizes);
            l.productSizes.byProduct    = filterSizesByProduct(l.productSizes);

            l.productOptions            = manager.getEntities('ProductOption');
            l.productOptions.byId       = filterById(l.productOptions);
            l.productOptions.byTag      = filterOptionsByTag(l.productOptions);
            l.productOptions.byProduct  = filterOptionsByProduct(l.productOptions);


            return lookups;
        }

        function buildOrderStatus( manager )
        {
            $log.debug( "buildOrderStatus()" );

            var os = { statuses : manager.getEntities('OrderStatus') };

            os.byId     = filterById(os.statuses);
            os.byName   = filterByName(os.statuses);

            // OrderStatus enums
            os.Ordered      = os.byName(/Ordered/i)[0];
            os.PickedUp     = os.byName(/PickedUp/i)[0];
            os.Delivered    = os.byName(/Delivered/i)[0];
            os.Cancelled    = os.byName(/Cancelled/i)[0];
            os.Pending      = os.byName(/Pending/i)[0];

            return os;
        }

        // Check if the lookup entities have already been loaded
        function hasLookups()
        {
            // assume has lookup entities if there are OrderStatuses
            return manager.getEntities('OrderStatus').length > 0;
        }
    }


    /*********************************************************
     * Array filter factories
     *********************************************************/

    function filterProductsByTag(products) {
        return function (tag) {
            return products.filter(function (p) { return p.type === tag; });
        };
    }
    function filterSizesByProduct(productSizes) {
        return function (product) {
            var sizeIds = product.productSizeIds;
            var type = product.type;
            if (sizeIds.length) {
                return productSizes.filter(function (ps) {
                    return (ps.type == type) && (sizeIds.indexOf(ps.id) >= 0);
                });
            } else {
                return productSizes.filter(function (ps) { return ps.type === type; });
            }
        };
    }
    function filterOptionsByTag(productOptions) {
        return function (tag) {
            if (tag == 'pizza') {
                return productOptions.filter(function (o) { return o.isPizzaOption; });
            } else if (tag == 'salad') {
                return productOptions.filter(function (o) { return o.isSaladOption; });
            }
            return [];  // drink tag has no options
        };
    }
    function filterOptionsByProduct(productOptions){
        return function (product) {
            var type = product.type;
            if (type == 'pizza') {
                if (product.hasOptions) {
                    return productOptions.filter(function(o) { return o.isPizzaOption;});
                } else {
                    // even pizza without options has crust and spice options
                    return productOptions.filter(
                        function (o) { return o.isPizzaOption &&
                            (o.type === "crust" || o.type === "spice");});
                }
            } else if (type == 'salad') {
                return productOptions.filter(function(o) { return o.isSaladOption; });
            }
            return [];  // drink tag has no options
        };
    }
    function filterById(array) {
        return function (id) {
            var item = array.filter(function (x) { return x.id == id; });//"==" ok; want coercion
            return item[0] || null;
        };
    }
    function filterByName(array) {
        // name is either a regExp or a string which is converted to a regex ignore case
        return function (name) {
            var re = (typeof name === 'string') ? new RegExp(name, 'i') : name;
            return array.filter(function (x) { return re.test(x.name); });
        };
    }
    function filterByType(array) {
        return function (type) {
            // type is either a regExp or a string which is converted to a regex ignore case
            var re = (typeof type === 'string') ? new RegExp(type, 'i') : type;
            return array.filter(function (x) { return re.test(x.type); });
        };
    }



}( define  ));
