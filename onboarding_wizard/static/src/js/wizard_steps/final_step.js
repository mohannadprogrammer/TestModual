import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class FinalStep extends Component {
    static template = "onboarding_wizard.FinalDashboardStep";
    static props = {
        onComplete: Function,
        onPrevious: Function,
        wizardId: { type: Number, optional: true },
        completionScore: { type: Number, optional: true },
        totalUsers: { type: Number, optional: true },
        installedModules: { type: Array, optional: true },
        emailStatus: { type: String, optional: true },
    };

    setup() {

        this.state = useState({
            stats: {
                completionScore: 75,
                totalModules: 5,
                totalUsers: 3,
                emailStatus: "configured",
            },
        });
    }

    getCompletionMessage() {
        return "🎉 You're All Set!";
    }

    async completeWizard() {
        // try {
        //     await this.rpc("/onboarding/wizard/mark_complete", {
        //         wizard_id: this.props.wizardId,
        //     });
        //     this.props.onComplete();
        // } catch (error) {
        //     console.error("Error completing wizard:", error);
        // }
    }
}
