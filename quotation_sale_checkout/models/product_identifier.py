from odoo import fields, models, _, api

class ProductIdentifier(models.Model):
    _inherit = 'product.template'
    cve_interna = fields.Char('Clave alterna')


class ProductProductIdentifier(models.Model):
    _inherit = 'product.product'

    @api.model
    def _name_search(self, name, args=None, operator='ilike', limit=100, name_get_uid=None):
        if name:
            positive_operators = ['=', 'ilike', '=ilike', 'like', '=like']
            if operator in positive_operators:
                product_ids = list(self._search([('cve_interna', 'ilike', name)] + args,
                                                limit=limit,
                                                access_rights_uid=name_get_uid))
                if product_ids:
                    return product_ids

        res = super(ProductProductIdentifier, self)._name_search(name, args, operator, limit, name_get_uid)
        return res
