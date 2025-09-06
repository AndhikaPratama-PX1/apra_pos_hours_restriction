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
        'views/assets.xml',
    ],   
    'images': [
        'static/description/apra_pos_hours_restriction.png',
    ],

    'maintainer': 'Apra IT Solutions',
    'price': 15.00,
    'currency': 'EUR',
}
