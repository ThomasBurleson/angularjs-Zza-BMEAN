(function( define ) {
    "use strict";

    define( [ ], function( )
    {
        // Build a `Order` class definition; without properties...
        return OrderClazz();
    });

    // **********************************************************
    //  Class Builder
    // **********************************************************

    /**
     * While BreezeJS will use the MetaData populate properties and values to each instance
     * we need to `add` business methods (logic) to the class.
     *
     * @see Metadata::addOrder()
     *
     *    function addOrder()
     *    {
     *        addType({
     *            name: 'Order',
     *            dataProperties: {
     *                id:        { type: ID },
     *                customerId:{ type: ID, null: false },
     *                name:      { max: 50, null: false },
     *                statusId:  { type: LUID, null: false, default: 1 },//default is 'Ordered'
     *                status:    { max: 20, null: false },
     *                ordered:   { type: DATE, null: false, default: "2014-01-01T08:00:00Z"},
     *                phone:     { max: 100 },
     *                delivered:      { type: DATE },
     *                deliveryCharge: { type: DECIMAL, null: false, default: 0 },
     *                deliveryAddress:{ complex: 'Address'},
     *                itemsTotal:     { type: DECIMAL, null: false, default: 0 },
     *                orderItems:     { complex: 'OrderItem', hasMany: true }
     *            },
     *            navigationProperties: {
     *                customer: 'Customer',
     *                orderStatus: {type: 'OrderStatus', fk: 'statusId'}
     *            }
     *        });
     *    }
     *
     *
     * @returns {Order}
     * @constructor
     */
    function OrderClazz( )
    {
        var Order = function() {},
            proto = Order.prototype;

            proto.addItem         = addItem;
            proto.addNewItem      = addNewItem;
            proto.removeItem      = removeItem;
            proto.getSelectedItem = getSelectedItem;

            proto.createOrderItem = null;   // @see OrderService::makeCreateOrderItem()

        return Order;

        // **********************************************************
        // Private Methods
        // **********************************************************

        /**
         * Create an order item for the specified product
         * and to the current order/draft
         *
         */
        function addNewItem( product )
        {
            return addItem( this.createOrderItem( product ) );
        }

        /**
         * Attach existing item to order.
         * This is used when moving items from `recently viewed` draft orders to
         * `cart` orders
         *
         */
        function addItem(item)
        {
            var list = this.orderItems;
            if (list.indexOf(item) == -1)
            {
                list.push(item);
            }

            // Reset `owner`
            item.order = this;

            return item;
        }

        /**
         * the item id is actually an index, expressed in origin 1
         *
         */
        function getSelectedItem(id)
        {
            // id == 1 + item's actual index
            return this.orderItems[id - 1] || null;
        }

        /**
         * Remove existing item from order
         *
         */
        function removeItem(item)
        {
            item.order = null;

            var ix = this.orderItems.indexOf(item);
            if (ix > -1) {
                this.orderItems.splice(ix, 1);
            }
        }
    }

}( define ));
