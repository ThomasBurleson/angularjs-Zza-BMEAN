(function( angular ) {
    'use strict';

    define([], function()
    {
        return [ '$stateProvider', '$urlRouterProvider', '$locationProvider', RouteManager ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * Configures the UI-Router states and their associated URL routes and views
     * Also adds "state-change" reporting for debugging during development
     */
    function RouteManager( $stateProvider, $urlRouterProvider, $locationProvider )
    {
        $stateProvider
            .state('app',
            {
                url: '',
                views: {
                    'header': {
                        templateUrl: 'src/zza/app/views/header.html'
                    },
                    'content': {
                        templateUrl: 'src/zza/app/views/welcome.html'
                    },
                    'footer': {
                        templateUrl: 'src/zza/app/views/footer.html'
                    }
                }
            })
                .state( 'app.welcome',
                {
                    url : '/welcome',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/app/views/home.html'
                        }
                    }
                })
                .state( 'app.about',
                {
                    url : '/about',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/app/views/about.html'
                        }
                    }
                })
                .state( 'app.customer',
                {
                    url: '/customer',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/customer/views/customer.html'

                        }
                    }
                })
                .state( 'app.order',
                {
                    // This is the shell layout for the Order dashboard (e.g. order.html)
                    // which has an sidebar area and an order content area
                    url : '/order',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/order/views/order.html'
                        },
                        'sidebar@app.order' : {
                            templateUrl: 'src/zza/order/views/orderSidebar.html'
                        }
                    }
                })
                    .state( 'app.order.item',
                    {
                        // An OrderItem editor state
                        // The state the user picks an OrderItem from one of the order
                        url : '/:orderId/:productType/:orderItemId',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'src/zza/order/views/orderItem.html'
                            }
                        }
                    })

                    .state( 'app.order.cart',
                    {
                        // This state shows the Cart items list view
                        url : '/cart',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'src/zza/order/views/cart.html'
                            }
                        }
                    })

                    .state( 'app.order.products',
                    {
                        // This state shows the Product listings (pizzas, salads, drinks)
                        // from which a product can be selected; selection navigates to the
                        // the produce details page.
                        url: '/:productType',
                        views : {
                            'content@app.order' : {
                                templateUrl: 'src/zza/menu/views/menu.html'
                            }
                        }
                    })
                        .state( 'app.order.products.item',
                        {
                            // An product detail `review and purchase` state
                            // The state after a user picks a product from a product menu
                            url : '/:productId',
                            views : {
                                'content@app.order' : {
                                    templateUrl : 'src/zza/order/views/orderItem.html'
                                }
                            }
                        });


        // @see http://scotch.io/quick-tips/js/angular/pretty-urls-in-angularjs-removing-the-hashtag

//        $locationProvider.html5Mode(true)
//                         .hashPrefix('!');

        $urlRouterProvider
            .when( '/menu', '/menu/pizza'  ) // Switch to Pizza listing view
            .otherwise('/menu/pizza');       // Return to the main ordering screen
    }

}( window.angular ));
