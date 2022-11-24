odoo.define('qsc.quotation.invoice_custom_rfc', function (require) {
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class CustomRFCWidget extends PosComponent {
        constructor() {
            super(...arguments);
        }

        currentOrderRFC() {
            const currentOrder = this.env.pos.get_order();
            const rfcs = this.env.pos.rfcs;

            if (currentOrder.rfc_id) {
                const assignedRFC = rfcs.find(rfc => rfc.id === currentOrder.rfc_id);
                if (assignedRFC) {
                    return `RFC: ${assignedRFC.rfc}`;
                }
            }

            return 'Seleccionar RFC';
        }

        async selectRFC() {
            const currentOrder = this.env.pos.get_order();
            const client = currentOrder.get_client();
            const rfcs = this.env.pos.rfcs;
            const filteredRFCs = rfcs.filter(rfc => rfc.partner_id === client.id)

            if (filteredRFCs && filteredRFCs.length > 0) {
                let res = await this.showPopup('RFCSelection',
                                               {
                                                   title: 'RFCs',
                                                   list: filteredRFCs.map(r => ({
                                                       id: r.id,
                                                       item: r,
                                                       label: `${r.rfc} | ${r.nombre}`,
                                                       isSelected: r.id === currentOrder.rfc_id
                                                   }))
                                               });

                let isRFCNew = false;
                if (res.payload === 'NEW_RFC') {
                    res = await this.showPopup('NewRFCPopupWidget', {})
                    isRFCNew = true;
                }
                this.setRFCSelection(res, isRFCNew);
            } else {
                let res = await this.showPopup('NewRFCPopupWidget', {})
                this.setRFCSelection(res, true);
            }
            this.render();
        }

        setRFCSelection(selection, isNew) {
            if (!selection) return;
            const currentOrder = this.env.pos.get_order();
            const {confirmed, payload} = selection;

            if (isNew) {
                this.env.pos.rfcs.push(payload);
            }

            if (confirmed && payload) {
                currentOrder.rfc_id = payload.id;
            }
        }
    }

    CustomRFCWidget.template = 'CustomRFCWidget';
    Registries.Component.add(CustomRFCWidget);

    return CustomRFCWidget;
});