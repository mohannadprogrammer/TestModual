from odoo import models, fields, api
class LearningTutorialStep(models.Model):
    _name = "learning.tutorial.step"

    tutorial_id = fields.Many2one(
        "learning.tutorial"
    )

    sequence = fields.Integer(default=10)

    title = fields.Char()

    content = fields.Text()

    target_selector = fields.Char(
        help="CSS selector"
    )

    position = fields.Selection([
        ("top", "Top"),
        ("bottom", "Bottom"),
        ("left", "Left"),
        ("right", "Right"),
    ])

    trigger_event = fields.Selection([
        ("click", "Click"),
        ("hover", "Hover"),
        ("none", "None"),
    ])