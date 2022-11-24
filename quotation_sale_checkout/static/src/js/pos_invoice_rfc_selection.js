odoo.define('qsc.quotation.invoice_rfc_selection', function (require) {
    "use strict";
    const {debounce} = owl.utils;
    const Registries = require('point_of_sale.Registries');
    const SelectionPopup = require('point_of_sale.SelectionPopup');

    class RFCSelection extends SelectionPopup {
        constructor() {
            super(...arguments);
            this.updateRFCList = debounce(this.updateRFCList, 70);
            this.state = {
                query: null,
                newRFC: false
            }
        }

        updateRFCList(event) {
            this.state.query = event.target.value;
            const clients = this.clients;

            if (event.code === 'Enter' && list.length === 1) {
                selectItem(list[0].id)
            } else {
                this.render();
            }
        }

        get items() {
            if (this.state.query && this.state.query.trim() !== '') {
                return this.props.list
                           .filter(r => {
                               return r.label &&
                                      typeof r.label === 'string' &&
                                      r.label
                                       .normalize('NFC')
                                       .toLocaleUpperCase()
                                       .includes(this.state.query
                                                     .normalize('NFC')
                                                     .toLocaleUpperCase());
                           });
            } else {
                return this.props.list;
            }
        }

        newRFC() {
            this.state.newRFC = true;
            this.confirm();
        }

        selectItem(itemId) {
            super.selectItem(itemId);
        }

        getPayload() {
            if (this.state.newRFC) {
                this.state.newRFC = false;
                return 'NEW_RFC';
            } else {
                return super.getPayload();
            }
        }
    }


    RFCSelection.template = 'RFCSelectionPopup';
    RFCSelection.defaultProps = {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        title: 'Select',
        body: '',
        list: [],
    };

    Registries.Component.add(RFCSelection);

    return RFCSelection;
});
