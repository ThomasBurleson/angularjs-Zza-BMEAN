(function( define ) {
    'use strict';

    define( [], function()
    {
        return [ 'customer.state', 'customerService', 'util', '$log', CustomerController];

        // **********************************************************
        // Class
        // **********************************************************

        /**
         * CustomerController provides a view model associated with the `customer.html` view
         * and its `customer.*.html` sub-view templates
         */
        function CustomerController(customerState, customerService, util, $log )
        {
            $log = $log.getInstance("CustomerController");

            var vm = this;

                vm.customers          = [];
                vm.orderHeaders       = [];
                vm.selectedCustomer   = null;
                vm.customerFilterText = '';

                vm.isLoadingCustomers = false;
                vm.isLoadingOrders    = false;

                vm.isSelected         = isSelected;
                vm.select             = selectCustomer;
                vm.filteredCustomers  = filteredByName;

            // Auto-load all known customers

            showLoading().then(    customerService.loadAll )
                         .then(    showCustomers           )
                         .finally( hideLoading             );

            // **********************************************************
            // Private Methods
            // **********************************************************

            function isSelected(customer)
            {
                return vm.selectedCustomer === customer;
            }

            function showCustomers(customers)
            {
                $log.debug( "showCustomers()" );

                vm.customers = customers;

                var found = filterByID( customerState.selectedCustomerId );

                select( (found && found.length) ? found[0] : null );
            }

            /**
             * Keep 'vm.selectedCustomerId' in a 'customerState' ngValue object
             * where it survives creation and destruction of this controller
             */
            function selectCustomer(customer)
            {
                if (vm.selectedCustomer === customer) return;  // no change

                $log.debug( "selectCustomer({id})", customer );

                vm.selectedCustomer = customer;
                customerState.selectedCustomerId = customer && customer.id;

                showLoading().then( getCustomerOrders )
                             .then( hideLoading       );

            }

            function getCustomerOrders(customer)
            {
                if ( !customer ) customer = vm.selectedCustomer;

                $log.debug( "getCustomerOrders({id})", customer );

                return customerService.getOrdersFor( customer )
                                      .then(function (orderHeaders)
                                      {
                                          vm.orderHeaders = orderHeaders;
                                      });
            }

            // **********************************************************
            // Loading Indicator methods
            // **********************************************************

            function showLoading()
            {
                vm.isLoadingCustomers = true;
                return util.resolved;
            }

            function hideLoading()
            {
                vm.isLoadingCustomers = false;
                return util.resolved;
            }

            // **********************************************************
            // Filter Methods
            // **********************************************************

            /**
             * Filter list to find customer by ID
             *
             * @param customer
             * @returns {boolean}
             */
            function filterByID( id )
            {
                if ( !id ) id = customerState.selectedCustomerId;

                $log.debug( "filterByID( `{0}` )",[id] );

                return vm.customers.filter( function ( customer )
                {
                    return customer.id === id;
                });
            }

            /**
             * Filter list to find customer by based on partial match to name
             *
             * @param customer
             * @returns {boolean}
             */
            function filteredByName( text )
            {
                if ( !text ) text = vm.customerFilterText.toLowerCase();

                $log.debug( "filteredByName( `{0}` )",[text] );

                return  (text === '') ? vm.customers : vm.customers.filter( filterByFullName );

                function filterByFullName( customer)
                {
                    return customer.firstName.toLowerCase().indexOf(text) == 0 ||
                           customer.lastName.toLowerCase().indexOf(text) == 0;
                }
            }


        }
    });

}( window.define ));
