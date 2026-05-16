from odoo import models, fields, api

class LearningTutorialStep(models.Model):
    _name = 'learning.tutorial.step'
    _description = 'Learning Tutorial Step'

    selector = fields.Char(string='CSS Selector', help='CSS selector to identify the UI element for this step')
    step_text = fields.Html(string='Step Text', help='Instructional text to display for this step')
    sequence = fields.Integer(string='Sequence', default=10)
    action_type = fields.Selection([
        ('tooltip', 'Tooltip'),
        ('modal', 'Modal Dialog'),
        ('inline', 'Inline Content'),
    ], string='Action Type', default='tooltip')

    name = fields.Char(string='Step Title', required=True)
    description = fields.Text(string='Step Description')
    content_id = fields.Many2one('learning.content', string='Associated Content')
    active = fields.Boolean(string='Active', default=True)

    