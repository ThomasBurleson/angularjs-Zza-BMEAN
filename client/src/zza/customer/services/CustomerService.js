(function( define ) {
    'use strict';

    define(
        [
          'mindspace/utils/supplant',
          'zza/customer/model/Customer',
          'zza/customer/model/Address'
        ],
        function( supplant, Customer, Address )
    {

        return [ 'orm', '$q', '$log', CustomerService ];

        // **********************************************************
        // Class
        // **********************************************************

        /**
         * CustomerService provides a delegate layer with all
         * and its `customer.*.html` sub-view templates
         */
        function CustomerService( orm, $q, $log )
        {
            $log = $log.getInstance("CustomerService");

            registerORModels();

            // Publish Customers' API

            return {
                loadAll         : loadAllCustomers,
                getOrdersFor    : getOrdersForCustomer
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

                var registerType = orm.store.registerEntityTypeCtor.bind(orm.store);

                registerType( 'Customer', Customer );
            }

            /**
             * Get a list of all known customers
             * @returns Promise
             */
            function loadAllCustomers()
            {
                $log.debug( "loadAllCustomers()" );

                var customers =  manager.getEntities('Customer');

                return  customers.length ? $q.when(customers) :
                        orm.EntityQuery.from('Customers')
                                        .orderBy('firstName, lastName')
                                        .using( orm.getManager() )
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

                return  !customer ? $q.reject( "Invalid Customer `null`" ) :
                        orm.EntityQuery.from('Orders')
                                        .where('customerId', 'eq', customer.id )
                                        .orderBy( 'ordered desc' )
                                        .select('id, statusId, status, ordered, delivered, deliveryCharge, itemsTotal')
                                        .using( orm.getManager() )
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

                $log.debug( supplant( "queryFailed( resource='{0}', error='{1}' )",[resourceName, error.message]) );
                $log.error( error.message, resourceName+" query failed" );

                throw error; // so downstream fail handlers hear it too
            }

        }
    });

}( window.define ));
