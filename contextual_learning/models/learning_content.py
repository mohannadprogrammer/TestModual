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
    ], string='Content Type')
    url = fields.Char(string='URL')
    model = fields.Many2one('ir.model', string='Related Model')
    model_name =fields.Char(string='Related Model Name', compute='_compute_model_name')
    module_ids = fields.Many2many('ir.module.module', string='Related Modules')
    view_type = fields.Selection([
        ('form', 'Form View'),
        ('kanban', 'Kanban View'),
        ('list', 'List View'), 
    ], string='Recommended View Type')

    
    sequence = fields.Integer(string='Sequence', default=10)

    @api.depends('model')
    def _compute_model_name(self):
        for record in self:
            record.model_name = record.model.model if record.model else ''