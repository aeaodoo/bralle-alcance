import logging

from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class SecondaryAccountingSetting(models.TransientModel):
    _inherit = 'res.config.settings'

    secondary_accounting_enabled = fields.Boolean()
    secondary_journal_id = fields.Many2one('account.journal',
                                           string='Journal',
                                           states={'draft': [('readonly', False)]},
                                           domain="[('type', '=', 'sale')]",
                                           )

    def set_values(self):
        super(SecondaryAccountingSetting, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('secondary_journal.secondary_accounting_enabled',
                                                         self.secondary_accounting_enabled)
        self.env['ir.config_parameter'].sudo().set_param('secondary_journal.secondary_journal_id',
                                                         self.secondary_journal_id.id)
    @api.model
    def get_values(self):
        res = super(SecondaryAccountingSetting, self).get_values()

        params = self.env['ir.config_parameter'].sudo()
        sae = params.get_param(
            "secondary_journal.secondary_accounting_enabled")

        sji = params.get_param(
            "secondary_journal.secondary_journal_id", default=False)
        res.update({
            'secondary_accounting_enabled': sae,
            'secondary_journal_id': int(sji)
        })

        return res

class AccountingMoveSecondaryJournal(models.Model):
    _inherit = 'account.move'
    @api.model
    def create(self, values):
        params = self.env['ir.config_parameter'].sudo()
        sae = params.get_param(
            "secondary_journal.secondary_accounting_enabled", default=False)

        sji = int(params.get_param(
            "secondary_journal.secondary_journal_id", default=False))

        request_journal = int(values.get('journal_id', False))
        if sae and request_journal != sji:
            req_j = self.env['account.journal'].search([('id', '=', request_journal),
                                                        ('type', '=', 'sale')])
            if req_j:
                values['journal_id'] = sji

        return super(AccountingMoveSecondaryJournal, self).create(values)
