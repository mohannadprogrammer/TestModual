import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class DocumentLayoutStep extends Component {
    static template = "onboarding_wizard.DocumentLayoutStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        documentLayout: { type: Object, optional: true },
        updateFormData: Function,
        errors: { type: Object, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.notification = useService("notification");

        this.state = useState({
            isSet: false
        });

        onWillStart(async () => {
            // await this.loadLayoutTemplates();
        });
    }

    openLayoutDesigner() {
        this.state.isSet = true;
        this.action.doAction(286);

    }
}
