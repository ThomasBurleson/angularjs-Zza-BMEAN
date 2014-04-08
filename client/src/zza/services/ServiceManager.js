(function( define ) {
    'use strict';

    define([], function() {
        return [
              'EntityManager'
            , 'breeze'
            , 'lookups'
            , 'model'
            , 'util'
            , ServiceManager];
    });

    // **********************************************************
    // Class Factory
    // **********************************************************

    /**
     * Query and save remote data with the Breeze EntityManager
     * Also exposes certain cached entities for easy ViewModel access
     */
    function ServiceManager(
          EntityManager
        , breeze
        , lookups
        , model
        , util
    ){
        var $log    = util.$log.getInstance( "ServiceManager" ),
            manager = EntityManager.getManager(),
            service = {
                  cartOrder     : null
                , draftOrder    : null
                , lookups       : lookups
                , getCustomers  : getCustomers
                , getOrderHeadersForCustomer: getOrderHeadersForCustomer
                , ready         : ready
                , resetManager  : resetManager
                , saveChanges   : saveChanges
            };

        return service;

        // **********************************************************
        // Private Methods
        // **********************************************************

        function ready(success, fail)
        {
            var promise = service.isReady || (service.isReady = initialize());
            return promise.then( success, fail );
        }

        function initialize()
        {
            $log.debug( "initialize" );
            return lookups.ready( createDraftAndCartOrders );
        }

        function createDraftAndCartOrders() {
            $log.debug( "createDraftAndCartOrders" );

            var orderInit = { orderStatus: lookups.OrderStatus.Pending};
            service.cartOrder  = model.Order.create(manager, orderInit);
            service.draftOrder = model.Order.create(manager, orderInit);
        }

        function getCustomers(){
            $log.debug( "getCustomers" );

            var customers =  manager.getEntities('Customer');
            return customers.length ?
                util.$q.when(customers) :

                breeze.EntityQuery.from('Customers')
                    .orderBy('firstName, lastName')
                    .using(manager).execute()
                    .then(function(data){return data.results;})
                    .catch(queryFailed);

        }

        function queryFailed(error){
            var resourceName = (error.query && error.query.resourceName) || '';

             $log.debug( util.supplant( "queryFailed( resource='{0}', error='{1}' )",[resourceName, error.message]) );
             $log.error( error.message, resourceName+" query failed" );

            throw error; // so downstream fail handlers hear it too
        }

        function getOrderHeadersForCustomer(customer){
            var query = breeze.EntityQuery.from('Orders')
                .where('customerId', 'eq', customer.id)
                .orderBy('ordered desc')
                .select('id, statusId, status, ordered, delivered, deliveryCharge, itemsTotal');

            return manager.executeQuery(query)
                .then(function(data){return data.results;})
                .catch(queryFailed);
        }


        function saveChanges() {
            return manager.saveChanges()
                         .then(saveSucceeded)
                         .catch(saveFailed);

            function saveSucceeded(saveResult) {
                $log.success("# of entities saved = " + saveResult.entities.length);
                $log.log(saveResult);

                return saveSucceeded;
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getSaveErrorMessages(error);
                error.message = msg;

                $log.error(error, msg);
                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                util.$timeout(function() {
                    manager.rejectChanges();
                }, 1000);
                throw error; // so caller can see it
            }
        }

        function getSaveErrorMessages(error)
        {
            var msg = error.message;
            var detail = error.detail;

            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            } else if (detail && detail.ExceptionType &&
                detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                // Concurrency error
                return "Another user, perhaps the server, " +
                    "may have changed or deleted an entity in the change-set.";
            }
            return msg;
        }

        function getValidationMessages(error)
        {
            var detail = error.detail;

            if (detail) { // Failed validation on the server
                try {
                    return 'Server ' + detail.ExceptionMessage + '\nStackTrace: ' + detail.StackTrace;
                } catch (e) {
                    return 'Server ' + error.message;
                }
            }

            // Failed on client during pre-Save validation
            try {
                return error.entitiesWithErrors.map(function (entity) {
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        return valError.errorMessage;
                    }).join(', \n');
                }).join('; \n');
            }
            catch (e) {
                return "validation error (error parsing exception :'" + e.message + "')";
            }
        }

        /**
         *  Reset the manager to its base state
         *  Clears the manager, re-populates with the lookups
         *  Creates a new draftOrder and cartOrder
         *
         */
        function resetManager( includeDatabase )
        {
            manager.clear(); // detaches everything
            attachEntities(lookups.OrderStatus.statuses);
            attachEntities(lookups.OrderStatus.statuses);
            attachEntities(lookups.OrderStatus.statuses);
            attachEntities(lookups.OrderStatus.statuses);
            createDraftAndCartOrders();

            return util.$q.when( includeDatabase ? resetDatabase() : true );

            // Should be in Breeze itself
            function attachEntities(entities ) {
                entities.forEach(function (entity) {
                    manager.attachEntity( entity );
                });
            }
        }

        /**
         * Service to reset the demo database to a "pristine" state
         * Also adds "state-change" reporting for debugging during development
         */
        function resetDatabase()
        {
            return util.$http.post( config.devServiceName + '/reset' )
                             .then( reportSuccess )
                             .error( reportError );

            // **********************************************************
            // Private Methods
            // **********************************************************

            function reportSuccess( response )   {
                return "Database reset succeeded with message: " + response;
            }
            function reportError( data, status ) {
                var message = "Database reset failed (" + status + ")";
                if (data) {
                    try { data = JSON.parse(data).Message; } finally { message += "\n" + data; }
                }
                return message;
            }
        }


    };


}( window.define ));
