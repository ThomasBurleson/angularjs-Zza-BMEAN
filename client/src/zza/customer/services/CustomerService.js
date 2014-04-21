(function( define ) {
    'use strict';

    define( [ ], function( )
    {
        return [ 'orm', 'util', CustomerService ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * CustomerService provides a delegate layer with all
     * and its `customer.*.html` sub-view templates
     */
    function CustomerService( orm, util )
    {
        var $log = util.$log.getInstance("CustomerService")
            breeze = orm.breeze;

        // Publish Customers' API

        return {
            loadAll         : loadAllCustomers,
            getOrdersFor    : getOrdersForCustomer
        };


        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * Get a list of all known customers
         * @returns Promise
         */
        function loadAllCustomers()
        {
            $log.debug( "loadAllCustomers()" );

            var customers =  orm.manager.getEntities('Customer');

            return  customers.length                        ?
                    util.$q.when(customers)                 :
                    breeze.EntityQuery.from('Customers')
                          .orderBy('firstName, lastName')
                          .using( orm.manager )
                          .execute()
                          .then( extractData, reportQueryFail );
        }

        /**
         * Load the SUMMARY information for all customer orders
         * @param customer
         * @returns Promise
         */
        function getOrdersForCustomer( customer )
        {
            $log.debug( "getOrdersForCustomer({id})", customer );

            return  !customer                                       ?
                    util.$q.reject( "Invalid Customer `null`" )     :
                    breeze.EntityQuery.from('Orders')
                          .where('customerId', 'eq', customer.id )
                          .orderBy( 'ordered desc' )
                          .select('id, statusId, status, ordered, delivered, deliveryCharge, itemsTotal')
                          .using( orm.manager )
                          .execute()
                          .then( extractData, reportQueryFail );
        }


        // **********************************************************
        // Response Handlers
        // **********************************************************


        function extractData( data )
        {
            return data ? data.results : null;
        }

        function reportQueryFail(error)
        {
            var resourceName = (error.query && error.query.resourceName) || '';

            $log.debug( util.supplant( "queryFailed( resource='{0}', error='{1}' )",[resourceName, error.message]) );
            $log.error( error.message, resourceName+" query failed" );

            throw error; // so downstream fail handlers hear it too
        }

    }

}( window.define ));
