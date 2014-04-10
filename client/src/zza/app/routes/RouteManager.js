(function( angular ) {
    'use strict';

    define([], function()
    {
        return [ '$stateProvider', '$urlRouterProvider', RouteManager ];
    });

    // **********************************************************
    // Class
    // **********************************************************

    /**
     * Configures the UI-Router states and their associated URL routes and views
     * Also adds "state-change" reporting for debugging during development
     */
    function RouteManager( $stateProvider, $urlRouterProvider )
    {
        $stateProvider
            .state('app',
            {
                url: '',
                views: {
                    'header': {
                        templateUrl: 'src/zza/app/tmpl/header.html'
                    },
                    'content': {
                        templateUrl: 'src/zza/app/tmpl/welcome.html'
                    },
                    'footer': {
                        templateUrl: 'src/zza/app/tmpl/footer.html'
                    }
                }
            })
                .state( 'app.welcome',
                {
                    url : '/welcome',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/app/tmpl/home.html'
                        }
                    }
                })
                .state( 'app.about',
                {
                    url : '/about',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/app/tmpl/about.html'
                        }
                    }
                })
                .state( 'app.order',
                {
                    // This is the shell layout for the Order dashboard (e.g. order.html)
                    // which has an orderSidebar area and an order content area
                    url : '/order',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/order/tmpl/order.html'
                        },
                        'orderSidebar@app.order' : {
                            templateUrl: 'src/zza/order/tmpl/orderSidebar.html'
                        },
                        'content@app.order' : {
                            // NOTE: Blank until filled by a more specific app.order state
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
                                templateUrl : 'src/zza/order/tmpl/orderItem.html'
                            }
                        }
                    })
                    .state( 'app.order.product',
                    {
                        // An OrderItem editor state
                        // The state after a user picks a product from a product menu
                        url : '^/menu/:productType/:productId',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'src/zza/order/tmpl/orderItem.html'
                            }
                        }
                    })
                    .state( 'app.order.cart',
                    {
                        // This state shows the Cart items list view
                        url : '/cart',
                        views : {
                            'content@app.order' : {
                                templateUrl : 'src/zza/order/tmpl/cart.html'
                            }
                        }
                    })

                .state( 'app.menu',
                {
                    // This state shows the Product listings (pizzas, salads, drinks)
                    // from which a product can be selected; selection navigates to the
                    // the produce details page.
                    url: '/menu/:productType',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/menu/tmpl/menu.html'
                        },
                        'orderSidebar@app.menu' : {
                            templateUrl: 'src/zza/order/tmpl/orderSidebar.html'
                        }
                    }
                })
                .state( 'app.customer',
                {
                    url: '/customer',
                    views : {
                        'content@' : {
                            templateUrl: 'src/zza/customer/tmpl/customer.html'

                        },
                        'orderSidebar@app.menu' : {
                            templateUrl: 'src/zza/order/tmpl/orderSidebar.html'
                        }
                    }
                });

        $urlRouterProvider
            .when( '/menu', '/menu/pizza'  ) // Switch to Pizza listing view
            .otherwise('/menu/pizza');       // Return to the main ordering screen
    }

}( window.angular ));
