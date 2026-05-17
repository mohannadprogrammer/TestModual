from odoo import models, fields, api

class LearningTutorial(models.Model):
    _name = "learning.tutorial"

    name = fields.Char(required=True)

    model_id = fields.Many2one("ir.model")

    active = fields.Boolean(default=True)

    step_ids = fields.One2many(
        "learning.tutorial.step",
        "tutorial_id"
    )