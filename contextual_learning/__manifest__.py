{
    "name":"Test 1 Odoo senior ",
    'category':'Learning',
    'version':"18.0.1.0.0",
    'author': 'Mohannad Waheed Ahmed Alshikh',
    'website': 'https://www.mohannadwaheed.site/',
    'description': """


            Test 1 Odoo Senior 
            ========================

                a modular contextual learning system that helps users understand and use
            Odoo features directly inside the application interface. The system should display
            tutorials, short videos, tips, and onboarding content dynamically according to the
            user's current context.
            """,
    'depends': ['web'],
    'data': [
        'security/ir.model.access.csv',
        'views/learning_content_views.xml',
        'views/learning_content_menu.xml',
    ],
    'assets':{
        'web.assets_backend':[
            'contextual_learning/static/src/services/*',
            'contextual_learning/static/src/components/**/*.js',
            'contextual_learning/static/src/components/*.js',
            'contextual_learning/static/src/components/**/*.xml',
            'contextual_learning/static/src/components/**/*.scss',
        ]
    },
    'application':True,
    'installable': True,
    'auto_install':False,
    'license':'LGPL-3'
}