/** @odoo-module **/

import { registry } from "@web/core/registry";
import { LearningPopup }
    from "./learning_popup/learning_popup";

registry.category("main_components").add(
    "learning_popup",
    {
        Component: LearningPopup,
    }
);