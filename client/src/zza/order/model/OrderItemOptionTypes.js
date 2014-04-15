(function(angular) {
    'use strict';

    define([], function( )
    {
        // Publish annotated Class
        return [ 'config', 'util', 'orderItemOption', OrderItemOptionTypes ];

        // **********************************************************
        // Class Factory
        // **********************************************************

        /**
         * OptionTypes: a model of the OrderItemOptions for a particular product type
         * The OrderItemController creates and displays instances of OptionTypes
         */
        function OrderItemOptionTypes( config, util, orderItemOption )
        {
            return {
                createVms: createVms
            };

            // **********************************************************
            // Private Methods
            // **********************************************************


            /**
             *  Create an orderItemOptionTypeVm for each distinct type of productOption (e.g., spice).
             *
             *  - Each vm will be displayed in its own tab
             *  - Each vm contains the orderItemOptionVms for its type of productOption (e.g., all spices).
             *
             */
            function createVms( orderItem )
            {
                // group the productOptions by type
                var optionVms = orderItem.createOrderOption();
                var groups = util.groupArray(
                    optionVms,
                    function (ovm) { return ovm.productOption.type; },
                    'type', 'options'
                );

                return groups.map( function (groupName)
                {
                    return new OptionGrouping(orderItem, group)
                });
            }

            // **********************************************************
            // Class
            // **********************************************************

            /**
             * OptionGrouping is a view model for all productOptions of a single type (e.g., spice)
             * for a single OrderItem.
             *
             * orderItem: the OrderItem associated with this VM
             * typeGroup:
             *    type: the type of productOption (e.g., spice)
             */
            function OptionGrouping(orderItem, group)
            {
                var model        = this,
                    isOneChoice = (group.type == 'crust'), // can only pick one crust
                    url         = util.supplant( config.templates.choiceURL,  [ isOneChoice ? "One" : "Many" ]),
                    maxFactor   = getCostFactor( group.options );

                    model.orderItem       = orderItem;
                    model.type            = group.type;
                    model.options         = group.options;
                    model.title           = util.toTitle(group.type);

                    model.columnOptions   = util.deal(model.options, 3);  // distribute the options in each tab among 3 columns
                    model.allFree         = maxFactor === 0;
                    model.someCostMore    = maxFactor > 1;
                    model.choiceTemplate  = url;

                    model.selectOption    = onSelectOptionChange;
                    model.selectOneOption = onSelectedOneOption;

                ensureOneOptionSelected();

                /**
                 *  Only one choice allowed among options
                 *  Will display with radio buttons which, unlike checkboxes,
                 *  must bind to something other than the choices.
                 *  The `tab.selectedOptionId` is that something.
                 *  p.s.: can't bind to option itmodel because of Ng circular-ref failure
                 *
                 * @param typeVm
                 */
                function ensureOneOptionSelected()
                {
                    if ( !isOneChoice ) return;

                    model.selectedOptionId = model.options[0].id; // default selection
                    model.options.forEach(function (opt)
                    {
                        // override default if any of the options is already selected
                        if (opt.selected) model.selectedOptionId = opt.id;
                    });
                    model.selectOneOption();
                }

                function getCostFactor( options )
                {
                    var maxFactor = 0;
                    options.forEach( function ( option ) {
                        maxFactor = Math.max(maxFactor, option.productOption.factor);
                    });

                    return maxFactor;
                }

                // **********************************************************
                // Selection Handler
                // **********************************************************

                function onSelectedOneOption()
                {
                    var optionGroup = this;
                    var selectedId = parseInt(optionGroup.selectedOptionId);

                    // reset the selected state for every option in this OptionVm
                    optionGroup.options.forEach(function (optionVm)
                    {
                        optionVm.selected = (optionVm.id === selectedId);
                        optionGroup.selectOption(optionVm);
                    });
                }

                function onSelectOptionChange( option )
                {
                    var orderItem = this.orderItem
                    var itemOption = option.itemOption;

                    if (option.selected)
                    {
                        if (!itemOption)
                        {
                            // no itemOption; create one
                            option.itemOption = orderItem.addNewOption(option.productOption);
                        }

                    } else if (itemOption) {

                        // option de-selected; remove it

                        orderItem.removeOption(itemOption);
                        option.itemOption = null;
                    }
                }
            }


        }
    });




}( this.angular ));
