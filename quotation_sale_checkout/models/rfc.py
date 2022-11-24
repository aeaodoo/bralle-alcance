from odoo import models, fields
import logging

_logger = logging.getLogger(__name__)


class RFC(models.Model):
    _name = 'bralle.rfc'
    _rec_name = 'rfc'
    _sql_constraints = [
        ('valid_email', "check(email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')", 'El email debe ser valido'),
        ('rfc_length', 'check(length(rfc) = 13)', 'RFC Invalido'),
        ('nombre_length', 'check(length(nombre) < 256)', 'Nombre demasiado largo'),
        ('address_length', 'check(length(address) < 256)', 'Direccion demasiado larga'),
        ('zip', 'check(length(zip) = 5)', 'CP invalido'),
        ('city', 'check(length(city) < 256)', 'Ciudad demasiado larga'),
    ]
    rfc = fields.Char('RFC', required=True)
    nombre = fields.Char('Nombre', required=True)
    address = fields.Char('Direccion')
    zip = fields.Char('CP')
    phone = fields.Char('Telefono')
    city = fields.Char('Ciudad')
    email = fields.Char('Email')
    state_id = fields.Many2one("res.country.state", string='Estado', ondelete='restrict',
                               domain="[('country_id', '=?', country_id)]")
    country_id = fields.Many2one('res.country', string='Pais', ondelete='restrict')
    partner_id = fields.Many2one('res.partner', string='Cliente')


class RFCToUser(models.Model):
    _inherit = 'res.partner'
    rfc_ids = fields.One2many('bralle.rfc', 'partner_id', 'RFCs')


class RFCToMove(models.Model):
    _inherit = 'account.move'
    rfc_id = fields.Many2one('bralle.rfc', string='RFC Usado')


class RFCToSale(models.Model):
    _inherit = 'sale.order'
    rfc_id = fields.Many2one('bralle.rfc', string='RFC Usado')
