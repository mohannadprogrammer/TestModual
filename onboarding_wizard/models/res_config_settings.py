from odoo import models, fields, api

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    onboarding_wizard_completed = fields.Boolean(string="Onboarding Wizard Completed", default=False)
    onboarding_wizard_skipped = fields.Boolean(string="Onboarding Wizard Skipped", default=False)
    onboarding_wizard_current_step = fields.Integer(string="Current Step ID", default=0)
    

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        company = self.env.company
        # // account_fiscal_country_id as code example for fetching existing config values to pre-populate the wizard
        res.update(
            onboarding_wizard_completed=self.env['ir.config_parameter'].sudo().get_param('onboarding_wizard_completed', default='False') == 'True',
            onboarding_wizard_skipped=self.env['ir.config_parameter'].sudo().get_param('onboarding_wizard_skipped', default='False') == 'True',
            onboarding_wizard_current_step=int(self.env['ir.config_parameter'].sudo().get_param('onboarding_wizard_current_step', default='0')),
            account_fiscal_country_id= company.account_fiscal_country_id.id,
        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('onboarding_wizard_completed', str(self.onboarding_wizard_completed))
        self.env['ir.config_parameter'].sudo().set_param('onboarding_wizard_skipped', str(self.onboarding_wizard_skipped))
        self.env['ir.config_parameter'].sudo().set_param('onboarding_wizard_current_step', str(self.onboarding_wizard_current_step))
        self.env['ir.config_parameter'].sudo().set_param('account_fiscal_country_id', str(self.account_fiscal_country_id.id))

        