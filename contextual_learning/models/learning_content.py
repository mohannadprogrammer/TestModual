from odoo import models, fields, api

class LearningContent(models.Model):
    _name = 'learning.content'
    _description = 'Learning Content'

    name = fields.Char(string='Title', required=True)
    description = fields.Text(string='Description')
    content_type = fields.Selection([
        ('video', 'Video'),
        ('article', 'Article'),
        ('interactive', 'Interactive'),
    ], string='Content Type', required=True)
    url = fields.Char(string='URL')
    model = fields.Many2one('ir.model', string='Related Model')
    module_ids = fields.Many2many('ir.module.module', string='Related Modules')
    view_type = fields.Selection([
        ('form', 'Form View'),
        ('kanban', 'Kanban View'),
        ('list', 'List View'), 
    ], string='Recommended View Type')

    
    sequence = fields.Integer(string='Sequence', default=10)