/*
 * A utility service loaded with helper methods and access to selected services
 * (e.g. logger, $timeout) that are often needed by other services.
 * Collecting them in a single util service reduces repetitious dependency injection
 * and long lists of constructor parameters in those services.
 */
(function( define ) {
    'use strict';

    define(['mindspace/utils/supplant', 'zza/utils/defineProperty' ], function( supplant, defineProperty )
    {

        return ['$http', '$q', '$rootScope', '$timeout', '$log', 'config', Utils];

        // **********************************************************
        // Class
        // **********************************************************

        function Utils( $http, $q, $rootScope, $timeout, $log, config ) {

            extendString();

            return {
                // bundle these so util clients don't have to get them
                $http               : $http,
                $q                  : $q,
                $timeout            : $timeout,
                $log                : $log,
                $broadcast          : performBroadcast,
                config              : config,

                supplant            : supplant,
                resolved            : $q.when(true),  // a re-usable resolved promise

                deal                : deal,
                defineProperty      : defineProperty,
                groupArray          : groupArray,
                keyArray            : arrayToObject,
                toTitle             : toTitle,

                getEntityByIdFromObj: getEntityByIdFromObj
            };

            // **********************************************************
            // Private Methods
            // **********************************************************


            function performBroadcast() {
                return $rootScope.$broadcast.apply($rootScope, arguments);
            }


            /*************************************************************
             * Complex type helpers
             *************************************************************/

            function getEntityByIdFromObj(obj, typeName, id)
            {
                var em = getEntityManager(obj);
                return (em) ? em.getEntityByKey(typeName, id) : null;
            }

            function getEntityManager(obj)
            {
                return  obj.complexAspect   ? obj.complexAspect.getEntityAspect().entityManager :
                        obj.entityAspect    ? obj.entityAspect.entityManager                    : null;
            }



            /*********************************************************
             * Return an entity's validation error messages as a string
             *********************************************************/

            /**
             * String extensions
             * Monkey punching JavaScript native String class
             * w/ format, startsWith, endsWith
             * go ahead and shoot me but it's convenient
             */
            function extendString() {
                var stringFn = String.prototype;
                if (stringFn.format) { return; } // already extended

                // Ex: "{0} returned {1} item(s)".format(queryName, count));
                stringFn.format = stringFn.format || function () {
                    var s = this;
                    for (var i = 0, len = arguments.length; i < len; i++) {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i]);
                    }

                    return s;
                };

                stringFn.endsWith = stringFn.endsWith || function (suffix) {
                    return (this.substr(this.length - suffix.length) === suffix);
                };

                stringFn.startsWith = stringFn.startsWith || function (prefix) {
                    return (this.substr(0, prefix.length) === prefix);
                };

                stringFn.contains = stringFn.contains || function (value) {
                    return (this.indexOf(value) !== -1);
                };
            }

            /*********************************************************
             * Deal an array of things into "hands" as if dealing cards.
             * e.g. deal([1,2,3,4,5,6,7], 3) -> [[1,4,7],[2,5],[3,6]]
             *********************************************************/
            function deal(arr, numHands) {
                var hands = new Array(numHands);
                var i, len = arr.length, hand;
                for (i = 0; i < numHands; i++) {
                    hands[i] = [];
                }
                for (i = 0; i < len; i++) {
                    hand = Math.ceil(i % numHands);
                    hands[hand].push(arr[i]);
                }
                return hands;
            }

            /*********************************************************
             // Group an array of objects by an object property. Each element of the returned array
             // is a object { keyName: key, valueName: [{...},...] }
             // arr: array of objects
             // keyfn: function to get the desired group key from each object
             // keyName: name of key property in resulting objects (defaults to 'key')
             // valueName: name of values property in resulting objects (defaults to 'values')
             // returns: array of key,values objects, where the values are objects from the original array.
             // See utilSpec.js for an example.
             *********************************************************/
            function groupArray(arr, keyfn, keyName, valueName) {
                keyName = keyName || 'key';
                valueName = valueName || 'values';
                var groupMap = {};
                var groupList = [];
                arr.forEach(function (o) {
                    var key = keyfn(o);
                    var group = groupMap[key];
                    if (!group) {
                        group = {};
                        group[keyName] = key;
                        group[valueName] = [];
                        groupMap[key] = group;
                        groupList.push(group);
                    }
                    group[valueName].push(o);
                });
                return groupList;
            }

            /*********************************************************
             // Convert an array into an object.  The returned object has keys defined by the keyfn,
             // and values from the original array.  If there are duplicate keys, the resulting object
             // has the value of the last key.
             // arr: array of objects
             // keyfn: function to get the desired group key from each object
             // See utilSpec.js for an example.
             *********************************************************/
            function arrayToObject(arr, keyfn) {
                var map = {};
                arr.forEach(function (o) {
                    var key = keyfn(o);
                    map[key] = o;
                });
                return map;
            }

            // Turn identifiers 'somethingLikeThis' into a title "Something Like This'
            // Example in Zza: orderItem.html uses it to build tab headers from
            // product option types (e.g., 'saladDressing' -> 'Salad Dressing')
            function toTitle(text) {
                return text ? convert() : "";
                function convert(){
                    // space before leading caps & uppercase the 1st character
                    // runs of caps are their own word, e.g., 'anHTMLstring' -> 'An HTML String'
                    return text.replace(/([A-Z]*[^A-Z]*)/g, ' $1')
                        .replace(/([A-Z]{2,})/g, '$1 ')
                        .trim()
                        .replace(/^\w/, function (c) { return c.toUpperCase(); });
                }
            };
        }

    });

})( window.define );
