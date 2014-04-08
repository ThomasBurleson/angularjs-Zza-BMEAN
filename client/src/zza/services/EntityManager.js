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
        return ['breeze', 'config', 'model', EntityManager];
    });

    // **********************************************************
    // EntityManager Class
    // **********************************************************


    function EntityManager( breeze, config, model )
    {
        configureBreezeForThisApp();

        var masterManager = null,
            serviceName   = config.serviceName,
            metadataStore = getMetadataStore(),
            service       = {
                getManager: getManager // get the "master manager", creating if necessary
            }

        return service;

        // **********************************************************
        // Private Methods
        // **********************************************************

        // get the "master manager", creating if necessary
        function getManager(){
            return masterManager || (masterManager = getInstance());

            function getInstance()
            {
                return new breeze.EntityManager({
                    serviceName     : serviceName,
                    metadataStore   : metadataStore
                });
            }
        }

        function getMetadataStore() {
            var metadataStore = new breeze.MetadataStore();

            // Associate these metadata data with this Node service
            metadataStore.addDataService(new breeze.DataService({ serviceName: serviceName }));

            // Extend model types with metadata, properties, and behavior
            model.addToMetadataStore(metadataStore);

            return metadataStore;
        }

        function configureBreezeForThisApp() {
            breeze.config.initializeAdapterInstance("dataService", "mongo", true);
            initBreezeAjaxAdapter(config.userSessionId);
        }

        function initBreezeAjaxAdapter(userSessionId) {
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
