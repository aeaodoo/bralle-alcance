# -*- coding: utf-8 -*-
{
  'name': "Odoo Woocommerce Connector, Multiple Woocommerce store connection, Import Customer, Orders, Products data - Odoo wordpress woocommerce Connector",
'version': '14.0.0.0',
   'summary': """
        Odoo Woocommerce Connector is bridge between odoo and woocommerce data import in odoo, Odoo Woocommerce Connector, Multiple Woocommerce store connection, Import Customer Data, Orders, Products, Odoo woocommerce wordpress Connector
       odoo 14, odoo 13, odoo 12, odoo  11.""",

   'description':"""
       Odoo Woocommerce Connector is bridge between odoo and woocommerce data import in odoo, Odoo Woocommerce Connector, Multiple Woocommerce store connection, Import Customer Data, Orders, Products, Odoo woocommerce wordpress Connector
     odoo 14, odoo 13, odoo 12, odoo 11.""",


  "depends"  :  ['odoo_multi_connect_sales_aagam'],
  "data"   :  [
            'security/ir.model.access.csv',
             'wizard/import_update_wizard.xml',
             'wizard/export_template.xml',
             'views/woc_config_views.xml',
             'data/import_cron.xml',
             'views/inherited_woocommerce_dashboard_view.xml',
             
             'data/default_data.xml',

            ],

    'application': True,
    'price': 70,
    'currency': 'EUR',
    'support': ': business@aagaminfotech.com',
    'author': 'Aagam Infotech',
    'website': 'http://aagaminfotech.com',
    'license': 'OPL-1',
    'images': ['static/description/images/Banner.gif'],
    "external_dependencies":  {'python': ['woocommerce']},
}
