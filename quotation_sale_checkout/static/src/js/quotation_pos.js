odoo.define('qsc.quotation', function (require) {
    'use strict';
    var rpc = require('web.rpc');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const {useState} = owl.hooks;

    class QuotationList extends PosComponent {
        constructor() {
            super(...arguments);
            this.state = useState({quotations: [], selected: undefined});
        }

        async addOrder(quotation) {
            const {
                      id, order_line: orderLine, partner_id: [p_id], order_barcode,
                      rfc_id, state
                  } = quotation;
            const db = this.env.pos.db;
            this.env.pos.delete_current_order();
            const currentOrder = this.env.pos.add_new_order();
            currentOrder.sale_order_id = id;
            currentOrder.barcode = order_barcode;
            currentOrder.state = state;

            if (rfc_id) {
                const [id, rfc] = rfc_id;
                currentOrder.rfc_id = id;
            }

            const products = await rpc.query({
                                                 model: 'sale.order.line',
                                                 method: 'read',
                                                 args: [orderLine],
                                                 fields: ['product_id', 'product_uom_qty']
                                             });
            const productToQuantity = {};
            products.forEach(p => {
                // Ignora notas y secciones
                if (!p.product_id) return;

                const [id, nombre] = p.product_id;
                if (!id) return;
                const product = db.get_product_by_id(id);
                if (!product) {
                    console.log("Producto not found, id: '", id, ":", nombre, "': ");
                    return;
                }
                productToQuantity[id] = p.product_uom_qty;

                this.trigger('click-product', product);
            });

            // Allow for 'click-product' trigger to finish
            setTimeout(() => {
                currentOrder.get_orderlines().forEach(ol => {
                    const qty = productToQuantity[ol.product.id];
                    ol.set_quantity(qty ? qty : 1);
                })
            }, 0)

            const partner = db.get_partner_by_id(p_id);
            currentOrder.set_client(partner);
            this.state.selected = id;
        }

        async retrieveQuotations() {
            const quotations = await rpc.query({
                                                   model: 'sale.order',
                                                   method: 'search_read',
                                                   fields: ['id',
                                                       'name',
                                                       'date_order',
                                                       'order_line',
                                                       'amount_total',
                                                       'user_id',
                                                       'company_id',
                                                       'partner_id',
                                                       'order_barcode',
                                                       'rfc_id',
                                                       'state'
                                                   ],
                                                   domain: [['pos_paid', '=', false]]
                                               });
            quotations.forEach(q => {
                q.vendedor = q.user_id[1] || '';
            });
            this.state.quotations = quotations;
        }

        async confirmQuotation(quotationId) {
            const response = await rpc.query({
                                                 model: 'sale.order',
                                                 method: 'action_confirm',
                                                 args: [[quotationId]]
                                             });
            if (response) {
                await this.retrieveQuotations();
                const currentOrder = this.env.pos.get_order();
                if (currentOrder.sale_order_id === quotationId) {
                    currentOrder.state = 'sale';
                }
            }
        }

        async willStart() {
            await this.retrieveQuotations();
        }
    }

    QuotationList.template = 'QuotationList';
    Registries.Component.add(QuotationList);

    return QuotationList
});