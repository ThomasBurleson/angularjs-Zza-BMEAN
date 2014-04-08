/*
 * Directive to prefix product image src string with the app's image base path
 * Usage:
 * <img class="img-polaroid" data-product-img-src="{{product.image}}" title="{{product.name}}"/>
 */
(function( define ) {
    'use strict';

    define([], function()
    {
        return [ 'config', ImageSourceDirective ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    function ImageSourceDirective( config )
    {
        return {
            priority: 99, // it needs to run after the attributes are interpolated
            link    : onLink
        };

        // **********************************************************
        // Private Methods
        // **********************************************************

        function onLink (scope, element, attrs) {

            attrs.$observe('productImgSrc', onSourceChange );

            function onSourceChange( value )
            {
                attrs.$set(
                    'src',
                    value ? config.productImageBasePath + value : config.productUnknownImage
                );
            }
        }



    };

}( window.define ));
