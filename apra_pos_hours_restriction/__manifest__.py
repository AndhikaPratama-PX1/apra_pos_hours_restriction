# -*- coding: utf-8 -*-
{
    'name': 'POS Opening Hours Restriction',
    'category': 'Point of Sale', 
    'author': 'Apra IT Solutions', 
    'version': '1.1',
    'license': 'LGPL-3',
    'summary': """
        Control your POS operating hours by restricting session opening and closing times. 
    """, 
    'depends': ['point_of_sale'],
    'data': [ 
        'views/pos_views.xml',
    ],   
    'assets': {
        'point_of_sale.assets': [
            'apra_pos_hours_restriction/static/src/js/*.js',
            'apra_pos_hours_restriction/static/src/js/ChromeWidgets/*.js',
            'apra_pos_hours_restriction/static/src/js/Popups/*.js',
        ],
    },
    'images': [
        'static/description/description.png',
    ],

    'maintainer': 'Apra IT Solutions',
    'price': 16.00,
    'currency': 'EUR',
}
