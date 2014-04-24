(function( define ) {
    'use strict';

    define( [], function()
    {
        return [ 'session', 'customerService', 'util', '$scope', CustomerController];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * CustomerController provides a view model associated with the `customer.html` view
     * and its `customer.*.html` sub-view templates
     */
    function CustomerController( session, customerService, util, $scope )
    {
        var $log               = util.$log.getInstance("CustomerController"),
            availableCustomers = [ ],
            vm                 = this;

            vm.customers          = availableCustomers;
            vm.selectedCustomer   = session.customer;
            vm.orderHeaders       = [];

            vm.isLoadingCustomers = false;
            vm.isLoadingOrders    = false;

            vm.select             = selectCustomer;
            vm.isSelected         = isSelected;

            vm.filterCriteria     = '';
            vm.filteredByName     = filteredByName;

        $log.debug( "vm instantiated..." );

        // Perform Auto-load all known customers

        showLoading()
             .then(    customerService.loadAll )
             .then(    showCustomers           )
             .then(    enableAutoSelect        )
             .finally( hideLoading             );


        // **********************************************************
        // Private Methods
        // **********************************************************

        function isSelected(customer)
        {
            return vm.selectedCustomer === customer;
        }


        /**
         *  Internally watch the filterCriteria for changes...
         *  then auto-select the customer if it is the ONLY one found...
         */
        function enableAutoSelect()
        {
            var unwatch = $scope.$watch( function()
                          {
                              return vm.filterCriteria;

                          }, autoSelectCustomer );

            // Make sure to `unwatch` when the controller is released...

            $scope.$on( "$destroy", unwatch );
        }


        /**
         * Show all available customers and select one if appropriate...
         * @param customers
         */
        function showCustomers( customers )
        {
            $log.debug( "showCustomers()" );

            vm.customers = availableCustomers = customers;

            if ( session.customer )
            {
                selectCustomer(findCustomerByID( customers.id ));

            }  else {

                autoSelectCustomer();
            }
        }

        /**
         * Auto select a customer if filtering finds only one (1) customer
         */
        function autoSelectCustomer()
        {
            var people = availableCustomers.filter( filteredByName),
                found  = (people.length == 1) ? people[0] : null;

            selectCustomer( found || vm.selectedCustomer );
        }

        /**
         * Copy the 'vm.selectedCustomer' to a 'session' object
         * where it survives creation and destruction of this controller
         */
        function selectCustomer(customer)
        {
            if (vm.selectedCustomer === customer) return;  // no change

            $log.debug( "selectCustomer({id})", customer );

            vm.selectedCustomer = customer;
            session.customer    = customer ;

            showLoading("orders").then( getCustomerOrders )
                                 .then( hideLoading       );

        }

        /**
         * Get a summary listing of orders for the selectedCustomer
         * @returns {*}
         */
        function getCustomerOrders()
        {
            var customer      = vm.selectedCustomer,
                showOrderList = function (orderHeaders)
                {
                    vm.orderHeaders = orderHeaders;
                };

            $log.debug( "getCustomerOrders({id})", customer );

            return customerService.getOrdersFor( customer )
                                  .then( showOrderList );
        }

        // **********************************************************
        // Loading Indicator methods
        // **********************************************************

        function showLoading(what)
        {
            vm.isLoadingCustomers = (what == "orders") ? false : true;
            vm.isLoadingOrders    = (what == "orders") ? true  : false;

            return util.$q.when( true );
        }

        function hideLoading()
        {
            vm.isLoadingCustomers = false;
            vm.isLoadingOrders    = false;

            return util.$q.when( true );
        }

        // **********************************************************
        // Filter Methods
        // **********************************************************

        /**
         * Locate customer by ID
         *
         * @param customer
         * @returns {boolean}
         */
        function findCustomerByID( id )
        {
            if ( !id ) id = (session.customer ? session.customer.id : null);

            $log.debug( "filterByID( `{0}` )",[id] );

            var list =  availableCustomers.filter( function ( customer )
                        {
                            return customer.id === id;
                        });

            return list.length ? list[0] : null;
        }

        /**
         * Filter list to find customer by based on partial match to name
         *
         * @param customer
         * @returns {boolean}
         */
        function filteredByName( item )
        {
            var full    = toLowerCase( item.fullName     );
            var partial = toLowerCase( vm.filterCriteria );

            return ( partial == "" ) || (-1 < full.indexOf(partial));
        }

        /**
         *
         * @param value
         * @returns {string}
         */
        function toLowerCase(value)
        {
            return (value || "").toLowerCase();
        }


    }

}( window.define ));
