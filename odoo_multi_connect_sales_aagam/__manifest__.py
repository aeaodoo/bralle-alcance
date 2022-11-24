# -*- coding: utf-8 -*-
{
  'name': "Odoo multiple connect sales depended for woocommerce odoo connector aagam",
  'version': '14.0.0.0',
  'summary': """
       This module is dependency for Odoo woocommerce connector, Odoo multiple connect sales depended for woocommerce odoo connector aagaminfotech - with this module woocommerce odoo connector is working perfectly
""",

  'description':"""
       This module is dependency for Odoo woocommerce connector, Odoo multiple connect sales depended for woocommerce odoo connector aagaminfotech - with this module woocommerce odoo connector is working perfectly
""",

    "depends": ['delivery'],
    "data": [
        'security/security.xml',
        'security/ir.model.access.csv',
        'wizard/wizard_view.xml',
        'wizard/feeds_wizard_view.xml',
        'views/template.xml',
        'views/res_config_view.xml',
        'views/product_skeleton_view.xml',
        'views/partner_skeleton_view.xml',
        'views/order_skeleton_view.xml',
        'views/pricelist_skeleton_view.xml',
        'views/woocomerce_category_view.xml',
        'views/woocomerce_multi_channel_sale_view.xml',
        'views/cwoocomerce_hannel_syncronization_view.xml',
        'views/woocomerce_account_view.xml',
        'wizard/export_products_wizard_view.xml',
        'wizard/export_templates_wizard_view.xml',
        'wizard/export_categ_wizard_view.xml',
        'views/shipping_skeleton_view.xml',
        'views/woocomerce_inherits.xml',
        'views/woocomerce_feeds_view.xml',
        'views/shipping_feed_view.xml',
        'views/multi_channel_skeleton_view.xml',
        'views/order_feed_view.xml',
        'views/woocomerce_attribute_value.xml',
        'views/menu_items.xml',
        'data/server_action.xml',
        'data/demo.xml',
        'data/cron.xml',

    ],
    'qweb': ["static/xml/appointment_dashboard.xml", ],
    "images": ['static/description/multiple-connect-sales.jpg'],
    "application": True,
    "installable": True,
    "auto_install": False,
    "price": 30,
    "currency": "USD",
    'support': ': business@aagaminfotech.com',
    'author': 'Aagam Infotech',
    'website': 'http://www.aagaminfotech.com',
    'license': 'OPL-1',
    "pre_init_hook"        :  "pre_init_check",
}
