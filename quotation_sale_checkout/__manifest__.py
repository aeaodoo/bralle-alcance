{
    'name': 'Quotation Sale Checkout',
    'version': '0.0.10',
    'category': 'sales',
    'depends': ['base', 'point_of_sale', 'sale'],
    'data': ['views/templates.xml',
             'views/res_config_settings_view.xml',
             'security/groups.xml',
             'security/ir.model.access.csv'],
    'demo': [],
    'qweb': [
        'static/src/views/quotation_list.xml',
        'static/src/views/available_rfcs.xml'
    ],
    'installable': True,
    'application': True,
    'auto_install': False
}
