odoo.define('qsc.quotation.sale_validation', function (require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');

    const PaymentScreenWidget = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }

            async check_order_is_confirmed() {
                const currentOrder = this.env.pos.get_order();
                if (currentOrder.state !== 'sale') {
                    this.showPopup('ErrorPopup', {
                        'title': 'Error',
                        'body': 'Debe confirmar la orden'
                    });
                    return false;
                }

                return true;
            }

            async validateOrder(isForceValidate) {
                let check = await this.check_order_is_confirmed();
                if (check) {
                    super.validateOrder(isForceValidate);
                }
            }
        }

    Registries.Component.extend(PaymentScreen, PaymentScreenWidget);

    return PaymentScreen;
});
