from odoo import models, fields, api

class BusinessType(models.Model):
    _name = 'business.type'
    _description = 'Business Type'

    name = fields.Char(string='Business Type', required=True)
    icon = fields.Char(string='Icon', help='Emoji or icon character')
    description = fields.Text(string='Description')
    recommended_modules = fields.Many2many('ir.module.module', string='Recommended Modules')