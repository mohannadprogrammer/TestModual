from odoo import models, fields, api

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    onboarding_wizard_completed = fields.Boolean(string="Onboarding Wizard Completed", default=False)
    onboarding_wizard_skipped = fields.Boolean(string="Onboarding Wizard Skipped", default=False)
    

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res.update(
            onboarding_wizard_completed=self.env['ir.config_parameter'].sudo().get_param('onboarding_wizard_completed', default='False') == 'True',
            onboarding_wizard_skipped=self.env['ir.config_parameter'].sudo().get_param('onboarding_wizard_skipped', default='False') == 'True',
        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('onboarding_wizard_completed', str(self.onboarding_wizard_completed))
        self.env['ir.config_parameter'].sudo().set_param('onboarding_wizard_skipped', str(self.onboarding_wizard_skipped))