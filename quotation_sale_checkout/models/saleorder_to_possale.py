from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)


class SaleOrderToPos(models.Model):
    _inherit = 'pos.order'
    _description = 'Agrega relacion entre sale.order y pos.order'
    sale_order_id = fields.Many2one(
        'sale.order',
        string='Sale Order',
        ondelete='set null'
    )

    @api.model
    def _order_fields(self, ui_order):
        order = super(SaleOrderToPos, self)._order_fields(ui_order)
        order['sale_order_id'] = ui_order['sale_order_id'] if 'sale_order_id' in ui_order else None
        return order

    def action_pos_order_paid(self):
        result = super(SaleOrderToPos, self).action_pos_order_paid()
        if self.sale_order_id:
            self.sale_order_id.write({
                'pos_paid': True
            })
        else:
            _logger.info('Sale order was undefined for this item')

        return result


class SaleOrder(models.Model):
    _inherit = 'sale.order'
    pos_orders = fields.One2many(
        'pos.order', 'sale_order_id',
        'Sale Orders'
    )
    pos_paid = fields.Boolean('Pagado en PoS')


class RFCToPoSOrder(models.Model):
    _inherit = 'pos.order'
    _description = 'Guarda RFC para mostrar invoice'

    rfc_id = fields.Many2one('bralle.rfc', string='Invoice RFC', ondelete='set null')

    @api.model
    def _order_fields(self, ui_order):
        order = super(RFCToPoSOrder, self)._order_fields(ui_order)
        order['rfc_id'] = ui_order['rfc_id'] if 'rfc_id' in ui_order else None
        return order

    def _prepare_invoice_vals(self):
        vals = super(RFCToPoSOrder, self)._prepare_invoice_vals()
        if self.rfc_id:
            vals['rfc_id'] = self.rfc_id
        return vals
