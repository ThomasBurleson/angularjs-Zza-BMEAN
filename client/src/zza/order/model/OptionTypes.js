(function(angular) {
    'use strict';

    define([], function( )
    {
        // Publish annotated Class
        return [ 'config', 'util', 'orderItemOption', OptionTypes ];

        // **********************************************************
        // Class Factory
        // **********************************************************

        /**
         * OptionTypes: a model of the OrderItemOptions for a particular product type
         * The OrderItemController creates and displays instances of OptionTypes
         */
        function OptionTypes( config, util, orderItemOption )
        {
            var manyChoiceTemplate = util.supplant( config.templates.choiceURL, ['Many'] ),
                oneChoiceTemplate  = util.supplant( config.templates.choiceURL, ['One'] );

            extendOptionTypes();

            return {
                createVms: createVms
            };

            // **********************************************************
            // Private Methods
            // **********************************************************


            function extendOptionTypes() {
                OptionTypeVm.prototype.selectOneOption  = selectOneOption;
                OptionTypeVm.prototype.selectOption = selectOption;

                return OptionTypeVm;
            }

            // Create an orderItemOptionTypeVm for each distinct type of productOption (e.g., spice).
            // Each vm will be displayed in its own tab
            // Each vm contains the orderItemOptionVms for its type of productOption (e.g., all spices).
            function createVms( orderItem )
            {
                // group the productOptions by type
                var optionVms = orderItemOption.createVms(orderItem);
                var typeGrps = util.groupArray(
                    optionVms,
                    function (ovm) { return ovm.productOption.type; },
                    'type', 'options'
                );
                var typeVms = typeGrps.map(function (tg) {return new OptionTypeVm(orderItem, tg)});
                return typeVms;
            }

            // OptionTypeVm is a viewmodel for all productOptions of a single type (e.g., spice)
            // for a single OrderItem.
            // orderItem: the OrderItem associated with this VM
            // typeGroup:
            //    type: the type of productOption (e.g., spice)
            //    options: OptionVms' for every productOption of that type
            function OptionTypeVm(orderItem, typeGroup){
                var typeVm = this;
                typeVm.orderItem = orderItem;
                typeVm.type = typeGroup.type;
                typeVm.options = typeGroup.options;
                typeVm.title = util.toTitle(typeVm.type);
                // distribute the options in each tab among 3 columns
                typeVm.columnOptions = util.deal(typeVm.options, 3);
                setOptionTypeVmCostFlags(typeVm);

                // indicates which typeVms allow only one choice
                var oneChoice = typeVm.type == 'crust'; // can only pick one crust
                typeVm.choiceTemplate = oneChoice ? oneChoiceTemplate : manyChoiceTemplate;
                if (oneChoice) {ensureOneOptionSelected(typeVm);}
            }

            function ensureOneOptionSelected(typeVm){
                // Only one choice allowed among options
                // Will display with radio buttons which, unlike checkboxes,
                // must bind to something other than the choices.
                // The `tab.selectedOptionId` is that something.
                // p.s.: can't bind to option itself because of Ng circular-ref failure
                typeVm.selectedOptionId = typeVm.options[0].id; // default selection
                typeVm.options.forEach(function (opt) {
                    // override default if any of the options is already selected
                    if (opt.selected) typeVm.selectedOptionId = opt.id;});
                typeVm.selectOneOption();
            }

            function setOptionTypeVmCostFlags(typeVm) {
                var maxFactor = 0;
                typeVm.options.forEach(function (o) {
                    maxFactor = Math.max(maxFactor, o.productOption.factor);
                });
                typeVm.allFree = maxFactor === 0;
                typeVm.someCostMore = maxFactor > 1;
            }

            function selectOneOption() {
                var optionTypeVm = this;
                var selectedId = parseInt(optionTypeVm.selectedOptionId);
                // reset the selected state for every option in this OptionVm
                optionTypeVm.options.forEach(function (optionVm) {
                    optionVm.selected = optionVm.id === selectedId;
                    optionTypeVm.selectOption(optionVm);
                });
            }

            function selectOption(optionVm) {
                var orderItem = this.orderItem
                var itemOption = optionVm.itemOption;

                if (optionVm.selected) {
                    if (!itemOption) {// no itemOption; create one
                        optionVm.itemOption = orderItem.addNewOption(optionVm.productOption);
                    }
                } else if (itemOption) { // option de-selected; remove it
                    orderItem.removeOption(itemOption);
                    optionVm.itemOption = null;
                }
            }
        }
    });




}( this.angular ));
