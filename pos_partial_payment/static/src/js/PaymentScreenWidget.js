odoo.define('pos_partial_payment.PaymentScreenWidget', function(require){
	'use strict';

	const PaymentScreen = require('point_of_sale.PaymentScreen');
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { Component } = owl;

	const PaymentScreenWidget = (PaymentScreen) =>
		class extends PaymentScreen {
			constructor() {
				super(...arguments);
			}

			async check_credit_validation(){
				let self = this;
				let currentOrder = this.env.pos.get_order();
				let orderlines = currentOrder.get_orderlines();					
				let plines = currentOrder.get_paymentlines();
				let dued = currentOrder.get_due();
				let changed = currentOrder.get_change();
				let client = currentOrder.get_client();
				let flag = 0;
				let pos_cur =  this.env.pos.config.currency_id[0];
				let company_id = this.env.pos.config.company_id;
				let call_super = true;
				
				if(orderlines.length === 0){
					call_super = false;
					return self.showPopup('ErrorPopup',{
						'title': this.env._t('Empty Order'),
						'body': this.env._t('There must be at least one product in your order before it can be validated.'),
					});
				}

				if (client){  //if customer is selected
					for (let i = 0; i < plines.length; i++) {
						if (plines[i].payment_method.is_credit === true  && plines[i].payment_method.is_cash_count === true) { 
							//we've given credit journal Type
							await self.rpc({
								model: 'pos.order',
								method: 'check_change_credit',
								args: [currentOrder ,plines[i].amount, plines[i].payment_method.id,currentOrder.pos_session_id],
							}).then(function(output) {
								let limit_amount = client.custom_credit + output
								if(client.allow_credit == false){
									call_super = false;
									return self.showPopup('ErrorPopup',{
										'title': self.env._t('Not Allow Credit Payment'),
										'body': self.env._t('You cannot use Credit payment.Please allow credit payment to this customer.'),
									});
								}
								if(client.allow_credit == true && client.allow_over_limit == false){
									if(client.custom_credit==0){
										if(currentOrder.get_change() > 0){
											call_super = false;
											return self.showPopup('ErrorPopup',{
												'title': self.env._t('Payment Amount Exceeded'),
												'body': self.env._t('You cannot Pay More than Total Amount'),
											});
										}else{
											self.rpc({
												model: 'res.partner',
												method: 'update_partner_credit',
												args: [client.id, output],
											});
											return true;
										}
									}else{ 
										if(client.custom_credit > 0){
											call_super = false;
											return self.showPopup('ErrorPopup',{
												'title': self.env._t('Not Allow Credit Payment'),
												'body': self.env._t('please pay credited amount first.'),
											});
										}
									}
								}
								if(client.allow_credit == true && client.allow_over_limit == true){
									if(currentOrder.get_change() > 0){ // Make Condition that pay exact amount, You cannot Pay More than Total Amount
										call_super = false;
										return self.showPopup('ErrorPopup',{
											'title': self.env._t('Payment Amount Exceeded'),
											'body': self.env._t('You cannot Pay More than Total Amount'),
										});
									}
									else if(limit_amount > client.limit_credit){
										call_super = false;
										return self.showPopup('ErrorPopup',{
											'title': self.env._t('Not Allow Credit Payment'),
											'body': self.env._t('Maximum Credit Limit for this customer reached.'),
										});
									}
									else{
										self.rpc({
											model: 'res.partner',
											method: 'update_partner_credit',
											args: [client.id, output],
										});
										return true;
									}
								} 
							});
						}
					}
				}
				if (!client){
					for (let i = 0; i < plines.length; i++) {
						if (plines[i].payment_method.is_credit === true  && plines[i].payment_method.is_cash_count === true) { //we've given credit journal Type
							flag += 1;
							return;
						}
					}
				}

				if(flag != 0){
					call_super = false;
					return self.showPopup('ErrorPopup',{
						'title': self.env._t('Unknown customer'),
						'body': self.env._t('You cannot use Credit payment. Select customer first.'),
					});
				}
				return call_super;
			}

			async validateOrder(isForceValidate) {
				let check = await this.check_credit_validation();
				if (check){
					super.validateOrder(isForceValidate);
				}
			}
	};

	Registries.Component.extend(PaymentScreen, PaymentScreenWidget);

	return PaymentScreen;

});