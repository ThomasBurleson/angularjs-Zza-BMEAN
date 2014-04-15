/*
 * Server delivers a new Breeze EntityManager on request.
 *
 * During service initialization:
 * - configures Breeze for use by this app
 * - gets entity metadata and sets up the client entity model
 * - configures the app to call the server during service initialization
 */
(function( define ) {
    'use strict';

    define([],function()
    {
        // Publish annotated Class
        return [ 'config', 'metadata', 'breeze',  EntityManager];
    });

    // **********************************************************
    // EntityManager Class
    // **********************************************************


    function EntityManager( config, metadata, breeze )
    {
        configureBreezeForThisApp();

        var masterManager = null,
            serviceName   = config.serviceName,
            store         = getMetadataStore(),
            service       = {
                breeze      : breeze,
                store       : store,
                manager     : getManager(),
                loadLookups : loadLookups,
                getNextID   : breeze.DataType.MongoObjectId.getNext
            };

        // Published API

        return service;

        // **********************************************************
        // Private Methods
        // **********************************************************


        /**
         * Load all lookup items
         * @returns {Promise}
         */
        function loadLookups()
        {
            return breeze.EntityQuery.from('Lookups')
                                    .using( getManager() )
                                    .execute();
        }


        // **********************************************************
        // Private Methods
        // **********************************************************

        // get the "master manager", creating if necessary
        function getManager()
        {
            return masterManager || (masterManager = getInstance());

            function getInstance()
            {
                return new breeze.EntityManager({
                    serviceName     : serviceName,
                    metadataStore   : store
                });
            }
        }

        /**
         * Creqte Breeze MetadataStore and associate these metadata data with this Node service
         * @returns {*}
         */
        function getMetadataStore()
        {
            var store = new breeze.MetadataStore();
                store.addDataService(new breeze.DataService({ serviceName: serviceName }));

            // Extend model types with metadata, properties, and behavior
            return  store ;
        }

        function configureBreezeForThisApp()
        {
            breeze.config.initializeAdapterInstance("dataService", "mongo", true);
            initBreezeAjaxAdapter(config.userSessionId);
        }

        function initBreezeAjaxAdapter(userSessionId)
        {
            // get the current default Breeze AJAX adapter
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                headers: {
                    "X-UserSessionId": userSessionId
                }
            };
        }

    }

}( window.define ));
