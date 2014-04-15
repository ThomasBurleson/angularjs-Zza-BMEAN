(function( define ) {
    "use strict";

    define( [ 'zza/utils/defineProperty' ], function(  defineProperty )
    {
        // Build a `OrderItem` class definition; without properties...
        return OrderItemClazz();

        // **********************************************************
        //  Class Builder
        // **********************************************************

        /**
         * While BreezeJS will use the MetaData populate properties and values to each instance
         * we need to `add` business methods (logic) to the class.
         *
         * @see Metadata::OrderItem()
         *
         *    function addOrderItem() {
         *        addType({
         *            name: 'OrderItem',
         *            isComplexType: true,
         *            dataProperties: {
         *                productId:     { type: LUID, null: false, default: 0 },
         *                name:          { max: 50, null: false },
         *                type:          { max: 50, null: false },
         *                productSizeId: { type: LUID, null: false, default: 0 },
         *                size:          { max: 50, null: false },
         *                quantity:      { type: DT.Int32, null: false, default: 1 },
         *                unitPrice:     { type: DECIMAL, null: false, default: 0 },
         *                totalPrice:    { type: DECIMAL, null: false, default: 0 },
         *                instructions:  { max: 255 },
         *                orderItemOptions: { complex: 'OrderItemOption', hasMany: true }
         *            }
         *        });
         *    }
         *
         * @returns {Order}
         * @constructor
         */
        function OrderItemClazz( )
        {
            var OrderItem = function() {},
                proto     = OrderItem.prototype;

                proto.addNewOption  = addNewOption;
                proto.removeOption  = removeOption;
                proto.restoreOption = addOption;

                defineProperty(OrderItem, "id"          , getID );
                defineProperty(OrderItem, "product"     , getProduct     , setProduct );
                defineProperty(OrderItem, "productSize" , getProductSize , setProductSize );

                // Special injected methods...
                proto.getEntityById     = null;   // @see OrderService::registerORModels()
                proto.createOrderOption = null;   // @see OrderService::makeCreateOrderOption()

            return OrderItem;

            // **********************************************************
            // Private Methods
            // **********************************************************


            /**
             * Add productOption to the order Item details...
             *
             * @param productOption
             * @returns {*}
             */
            function addNewOption(productOption)
            {
                return this.addOption( this.createOrderOption( productOption ) );
            }


            function addOption( option )
            {
                var list = this.orderItemOptions;
                if ( list.indexOf(option) == -1 )
                {
                    list.push(option);
                }

                // Reset `owner`
                option.orderItem = this;

                return option;
            }

            function removeOption(option)
            {
                option.orderItem = null;
                var ix = this.orderItemOptions.indexOf(option);
                if (ix > -1) {
                    this.orderItemOptions.splice(ix, 1);
                }
            }

            // **********************************************************
            // Getters and Setter Methods
            // **********************************************************

            /**
             * OrderItem doesn't have an id; pseudo-id property is position
             * @returns {*}
             */
            function getID()
            {
                var parentOrder = this.complexAspect ? this.complexAspect.parent : null;
                // id == 1 + item's index
                return parentOrder ? 1 + parentOrder.orderItems.indexOf(this) : 0;
            }

            function getProduct()
            {
                var id = this.productId;
                return (id) ? this.product = this.getEntityById(this, 'Product', id) : null;
            }

            function setProduct(product)
            {
                this.productId = product ? product.id : 0;
                this.name = product ? product.name : '';
                this.type = product ? product.type : '';
            }

            function getProductSize()
            {
                var id = this.productSizeId;
                return (id) ? this.productSize = this.getEntityById(this, 'ProductSize', id) : null;
            }

            function setProductSize(size)
            {
                this.productSizeId = size ? size.id : 0;
                this.size = size ? size.name : '';
            }

        }
    });



}( define ));
