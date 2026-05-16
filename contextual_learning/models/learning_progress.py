from odoo import models, fields, api

class LearningProgress(models.Model):
    _name = 'learning.progress'
    _description = 'Learning Progress'

    user_id = fields.Many2one('res.users', string='User', required=True)
    content_id = fields.Many2one('learning.content', string='Content', required=True)
    completed = fields.Boolean(string='Completed', default=False)
    completion_date = fields.Date(string='Completion Date')
    skipped = fields.Boolean(string='Skipped', default=False)
    feedback = fields.Text(string='User Feedback')
    percentage_completed = fields.Float(string='Percentage Completed', default=0.0)
    timestamp = fields.Datetime(string='Last Updated', default=fields.Datetime.now, onupdate=fields.Datetime.now)