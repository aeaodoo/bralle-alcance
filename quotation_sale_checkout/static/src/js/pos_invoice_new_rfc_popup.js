odoo.define('qsc.quotation.invoice_new_rfc_popup', function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const Registries = require('point_of_sale.Registries');
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');

    class NewRFCPopupWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            this.state = useState({rfcDatum: undefined});
        }

        async newRFC() {
            const self = this;
            const currentOrder = this.env.pos.get_order();
            const client = currentOrder.get_client();
            const nombre = $("#rfc_nombre").val();
            const rfc = $("#rfc_rfc").val();
            const direccion = $("#rfc_direccion").val();
            const email = $("#rfc_email").val();

            if (!nombre || nombre.trim() === '') {
                self.showPopup('ErrorPopup', {
                    'body': 'El nombre es obligatorio'
                })
            }
            if (!rfc || rfc.trim() === '') {
                self.showPopup('ErrorPopup', {
                    'body': 'El RFC es obligatorio'
                })
            }
            if (!direccion || direccion.trim() === '') {
                self.showPopup('ErrorPopup', {
                    'body': 'La direccion es obligatorio'
                })
            }
            if (!email || email.trim() === '') {
                self.showPopup('ErrorPopup', {
                    'body': 'El email es obligatorio'
                })
            }

            const newRFC = await self.rpc(
                {
                    model: 'bralle.rfc',
                    method: 'create',
                    args: [{
                        rfc,
                        nombre,
                        address: direccion, email, partner_id: client.id
                    }]
                });

            if (!newRFC) {
                self.showPopup('ErrorPopup', {
                    'body': 'Error de comunicacion'
                });
                return;
            }

            const datums = await self.rpc(
                {
                    model: 'bralle.rfc',
                    method: 'search_read',
                    fields: ['rfc', 'nombre', 'partner_id'],
                    domain: [['id', '=', `${newRFC}`]]
                }
            );
            if (!datums || !datums instanceof Array || datums.length === 0) {
                self.showPopup('ErrorPopup', {
                    'body': 'Error de comunicacion'
                });
                return;
            }

            const rfcDatum = datums[0];
            const partner = rfcDatum.partner_id;
            this.state.rfcDatum = ({
                ...rfcDatum,
                partner: partner[1],
                partner_id: partner[0]
            });
            this.confirm();
        }

        getPayload() {
            return this.state.rfcDatum;
        }
    }

    NewRFCPopupWidget.template = "NewRFCPopup";
    Registries.Component.add(NewRFCPopupWidget);
    return NewRFCPopupWidget;
});