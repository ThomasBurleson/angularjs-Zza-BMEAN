(function( define ) {
    "use strict";

    define( [ ], function( ) 
    {
        // Publish isolated, utility function
        return defineProperty;
    });
    
    // **********************************************************
    // defineProperty Function
    // **********************************************************

    /**
     *  Assist in adding an ECMAScript 5 "definedProperty" to a class
     */
    function defineProperty(klass, propertyName, getter, setter)
    {
        var config = {
            enumerable: true,
            get: getter
        };

        if (setter){
            config.set = setter;
        }
        Object.defineProperty(klass.prototype, propertyName, config);

        return klass;
    }

}( window.define ));
