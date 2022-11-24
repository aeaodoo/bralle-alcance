odoo.define('pos_partial_payment.pos', function (require) {
	"use strict";

	var models = require('point_of_sale.models');

	models.load_fields('res.partner', ['custom_credit','allow_credit','allow_over_limit','limit_credit'])
	models.load_fields('pos.payment.method', ['is_credit'])
	
});
