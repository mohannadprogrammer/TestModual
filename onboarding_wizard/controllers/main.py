# # -*- coding: utf-8 -*-
# # Part of Odoo. See LICENSE file for full copyright and licensing details.

# from odoo import http
# from odoo.http import request

# class OnboardingWizardController(http.Controller):
    
#     @http.route('/onboarding/wizard', type='http', auth='user', website=True)
#     def onboarding_wizard(self, **kw):
#         """Render the onboarding wizard page"""
#         return request.render('onboarding_wizard.OnboardingWizard', {
#             'wizard_data': self._get_wizard_data(),
#         })
    
#     @http.route('/onboarding/wizard/data', type='json', auth='user', website=True)
#     def get_wizard_data(self, **kw):
#         """API endpoint to fetch wizard data"""
#         return self._get_wizard_data()
    
#     def _get_wizard_data(self):
#         """Helper method to get wizard data"""
#         user = request.env.user
#         company = user.company_id
        
#         return {
#             'user_id': user.id,
#             'user_name': user.name,
#             'company_id': company.id,
#             'company_name': company.name,
#             'company_country': company.country_id.name if company.country_id else '',
#             'company_currency': company.currency_id.name if company.currency_id else '',
#         }