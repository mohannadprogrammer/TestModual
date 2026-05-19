import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class FinalStep extends Component {
    static template = "onboarding_wizard.FinalDashboardStep";
    static props = {
        onComplete: Function,
        onPrevious: Function,
        closeWizard: Function,
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            completionScore: 100,
            totalModules: 5,
            totalUsers: 3,
            emailStatus: "configured",

        });
        onWillStart(async () => {
            this.loadStats();
        });
    }
    //load stats from server (simulate with timeout for now)
    async loadStats() {
        try {
            const installedModules = await this.orm.call("ir.module.module", "search_count", [[["state", "=", "installed"]]]);
            const totalUsers = await this.orm.call("res.users", "search_count", [[]]);
            const emailStatus = await this.orm.call("ir.mail_server", "search_count", [[]]) > 0 ? "configured" : "not_configured";
            // this.state.completionScore = Math.round(( / 10) * 100); // Assuming 10 modules to install for full score
            this.state.totalModules = installedModules;
            this.state.totalUsers = totalUsers;
            this.state.emailStatus = emailStatus;
            console.log("Stats loaded:", this.state);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    }
    getCompletionMessage() {

        return "🎉 You're All Set!";
    }

    async completeWizard() {

        const settingsId = await this.orm.create(
            "res.config.settings",
            [
                {
                    onboarding_wizard_completed: true,
                }
            ]
        );
        await this.orm.call(
            "res.config.settings",
            "set_values",
            [settingsId]
        );
        this.props.closeWizard();
    }
}
