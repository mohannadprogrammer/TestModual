
{
    'name': 'Test 2 Odoo Senior 2',
    'category': 'Hidden',
    'version': '18.0.1.0.0',
    'author': 'Mohannad Waheed Ahmed Alshikh',
    'website': 'https://www.mohannadwaheed.site/',
    'description': """
            Test 2 Odoo Senior 2
            ========================

            a modular onboarding system that detects first login, launches a multi-step setup
            wizard, saves progressive configuration, dynamically installs modules, configures
            company data, and creates default business workflows.
            """,
    'depends': [ 
        'web',
        'base',
        'hr',
        'account',
        'accountant',
        'l10n_sa_edi',
        'l10n_sa_edi'
    
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/business_type_data.xml',
        'views/business_type_views.xml',
        'views/business_type_menu.xml',
        'views/res_config_settings_views.xml',
    ],
    'assets': {
       'web.assets_backend': [
           'onboarding_wizard/static/src/js/onboarding_wizard.js', 
           'onboarding_wizard/static/src/js/webclient.js',
           'onboarding_wizard/static/src/js/wizard_steps/*.js',
           'onboarding_wizard/static/src/js/main.js',
           'onboarding_wizard/static/src/scss/onboarding_wizard_popup.scss',
           'onboarding_wizard/static/src/scss/onboarding_wizard.scss',
           'onboarding_wizard/static/src/xml/onboarding_wizard_templates.xml',
           'onboarding_wizard/static/src/xml/welcome_step_template.xml',
           'onboarding_wizard/static/src/xml/company_info_step_template.xml',
           'onboarding_wizard/static/src/xml/business_activity_step_template.xml',
           'onboarding_wizard/static/src/xml/team_users_step_template.xml',
           'onboarding_wizard/static/src/xml/accounting_config_step_template.xml',
           'onboarding_wizard/static/src/xml/document_layout_step_template.xml',
           'onboarding_wizard/static/src/xml/final_step_template.xml',
           'onboarding_wizard/static/src/xml/webclient.xml',
       ],
       'web.assets_web': [
            ('replace', 'web_enterprise/static/src/main.js', 'onboarding_wizard/static/src/js/main.js'),
        ],
    },
    "installable": True,
    'auto_install': True,
    'license': 'LGPL-3',
}
