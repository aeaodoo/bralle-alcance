import time
import re
import random

from odoo import fields, models


class QuotationBarcode(models.Model):
    _inherit = 'sale.order'
    _description = 'Agrega barcode'

    def _gen_ean13(self):
        def _calculate_ean13(ean):
            nstr = re.sub('[^0-9]', '0', ean[:12])
            odds = nstr[0::2]
            pairs = nstr[1::2]
            checksum = sum([int(x) for x in odds]) + \
                       (sum([int(x) for x in pairs]) * 3)
            ver = checksum % 10
            if ver == 0:
                return nstr + '0'
            else:
                return nstr + str(10 - ver)

        order_prefix = '31'
        r = str(random.randint(10, 99))[:2]
        ts = str(int(time.time() * 100))[4:12]
        ean = _calculate_ean13(order_prefix + ts + r)
        return ean[:13]

    order_barcode = fields.Char('Sale Barcode', default=_gen_ean13)
