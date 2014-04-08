(function( define ) {
    'use strict';

    define([],function()
    {
        // Publish annotated Class
        return [ 'breeze', 'EntityManager', 'util', '$log', Lookups ];
    });

    // **********************************************************
    // Lookup Class
    // **********************************************************

    /**
     *  Extends the dataservice with easy access to "Lookups"
     *  which it fetches from the server.
     *
     *  "Lookups" are relatively-stable reference entities
     *  typically presented as choices for property values of primary entities.
     *
     *  e.g. Products, ProductOptions, ProductSizes
     */
    function Lookups( breeze, EntityManager, util, $log )
    {
        $log = $log.getInstance( 'Lookups' );

        var service,
            isReady = null,
            manager = EntityManager.getManager();   // get the master manager

        return service = {
            ready        : makeReady,
            fetchLookups : queryForLookups
            // extended during initialization
        };

        // **********************************************************
        // Private Methods
        // **********************************************************

        function makeReady( success, fail )
        {
            return isReady = (isReady || initialize()).then( success,  fail );
        }

        function initialize()
        {
            $log.debug( "initialize()" );

            if ( hasLookups() )
            {
                extendService(manager);
                return util.resolved;

            } else {

                return queryForLookups();
            }
        }

        function queryForLookups()
        {
            $log.debug( "queryForLookups()" );

            return breeze.EntityQuery.from('Lookups')
                              .using(manager)
                              .execute()
                              .then(
                                  function () {
                                      $log.info( "Lookups loaded from server." );
                                      return extendService();
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
        function extendService()
        {
            $log.debug( "extendService()" );

            var s = service;

            s.OrderStatus               = buildOrderStatus( manager );

            s.products                  = manager.getEntities('Product');
            s.products.byId             = filterById(s.products);
            s.products.byName           = filterByName(s.products);
            s.products.byTag            = filterProductsByTag(s.products);

            s.productSizes              = manager.getEntities('ProductSize');
            s.productSizes.byId         = filterById(s.productSizes);
            s.productSizes.byProduct    = filterSizesByProduct(s.productSizes);

            s.productOptions            = manager.getEntities('ProductOption');
            s.productOptions.byId       = filterById(s.productOptions);
            s.productOptions.byTag      = filterOptionsByTag(s.productOptions);
            s.productOptions.byProduct  = filterOptionsByProduct(s.productOptions);


            return service;
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
        function hasLookups(){
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
