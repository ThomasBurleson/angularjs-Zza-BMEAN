(function( define ) {
    'use strict';

    define( [], function()
    {
        return [ 'customer.state', 'dataservice', CustomerController];

        // **********************************************************
        // Class
        // **********************************************************

        /**
         * CustomerController provides a view model associated with the `customer.html` view
         * and its `customer.*.html` sub-view templates
         */
        function CustomerController(customerState, dataservice) {

            var vm = this;
                vm.customerFilterText = '';
                vm.customers = [];
                vm.filteredCustomers = filteredCustomers;
                vm.isLoadingCustomers = false;
                vm.isLoadingOrders = false;
                vm.isSelected = isSelected;
                vm.orderHeaders = [];
                vm.select = select;
                vm.selectedCustomer = null;

            dataservice.ready(function getCustomers()
            {
                vm.isLoadingCustomers = true;

                dataservice.getCustomers()
                           .then( gotCustomers )
                           .finally( clearLoadingIndicator );

                function gotCustomers(customers) {
                    vm.customers = customers;
                    var id = customerState.selectedCustomerId;
                    if (id) {
                        var customer = customers.filter(function (c) {
                            return c.id === id
                        })[0];
                        select(customer);
                    }
                }

                function clearLoadingIndicator( ) {
                    vm.isLoadingCustomers = false;
                }
            });

            // **********************************************************
            // Private Methods
            // **********************************************************

            function filteredCustomers() {
                var text = vm.customerFilterText.toLowerCase();
                return text === '' ?
                    vm.customers :
                    vm.customers.filter(function (c) {
                        return c.firstName.toLowerCase().indexOf(text) == 0 ||
                            c.lastName.toLowerCase().indexOf(text) == 0;
                    })
            }


            function getCustomerOrderHeaders(customer) {
                vm.isLoadingOrders = true;
                dataservice.getOrderHeadersForCustomer(customer)
                    .then(function (orderHeaders) {
                        vm.orderHeaders = orderHeaders;
                    })
                    .finally(function () {
                        vm.isLoadingOrders = false;
                    });
            }

            function isSelected(customer) {
                return vm.selectedCustomer === customer;
            }

            // Keep 'vm.selectedCustomerId' in a 'customerState' ngValue object
            // where it survives creation and destruction of this controller
            function select(customer) {
                if (vm.selectedCustomer === customer) {
                    return;
                }  // no change
                vm.selectedCustomer = customer;
                customerState.selectedCustomerId = customer && customer.id;
                getCustomerOrderHeaders(customer);
            }
        }
    });

}( window.define ));
