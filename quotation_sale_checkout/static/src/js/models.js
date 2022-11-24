odoo.define('qsc.quotation.models', function (require) {
    "use strict";

    var models = require('point_of_sale.models');

    const baseOrder = models.Order.prototype;

    models.Order = models.Order.extend(
        {
            init_from_JSON: function (json) {
                this.sale_order_id = json.sale_order_id;
                this.rfc_id = json.rfc_id;
                this.state = json.state;
                return baseOrder.init_from_JSON.call(this, json);
            },
            export_as_JSON: function () {
                const data = baseOrder.export_as_JSON.call(this, arguments);
                data.sale_order_id = this.sale_order_id;
                data.rfc_id = this.rfc_id;
                data.state = this.state;
                return data;
            },
            export_for_printing: function () {
                const result = baseOrder.export_for_printing.call(this, arguments);
                result.barcode = this.barcode;
                result.barcodeUrl = `/report/barcode/?type=EAN13&value=${this.barcode}&width=200&height=100`;
                return result;
            }
        })
});