

import { Component, onMounted, onWillStart, useExternalListener, useState } from "@odoo/owl";
import {
    WelcomeStep,
    CompanyInfoStep,
    BusinessActivityStep,
    TeamUsersStep,
    AccountingConfigStep,
    DocumentLayoutStep,
    FinalStep
} from "./wizard_steps/index";

import { useService } from "@web/core/utils/hooks";

console.log("onboarding wizard component loaded")
export class OnboardingWizard extends Component {
    static template = "onboarding_wizard.OnboardingWizard";
    static props = {};
    static components = {
        WelcomeStep,
        CompanyInfoStep,
        BusinessActivityStep,
        TeamUsersStep,
        AccountingConfigStep,
        DocumentLayoutStep,
        FinalStep
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            current_step: 0,
            completion_score: 0,
            total_users_created: 0,
            showWizard: true,
        });
        this.loadInitialData();
    }
    async loadInitialData() {
        try {
            const completion = await this.orm.call("res.config.settings", "get_values", []);
            this.state.showWizard = completion.onboarding_wizard_completed === false && completion.onboarding_wizard_skipped === false;
            this.state.current_step = parseInt(completion.onboarding_wizard_current_step) || 0;
            console.log("Initial data loaded:", completion);

            this.state.completion_score = completion || 0;

        } catch (error) {
            console.error("Error loading data:", error);
        }
    }
    /**
     * Move to the next step
     */
    async nextStep() {
        if (this.state.current_step < 6) {
            this.state.current_step++;
            const settingsId = await this.orm.create(
                "res.config.settings",
                [
                    {
                        onboarding_wizard_current_step: this.state.current_step,
                    }
                ]
            );
            await this.orm.call(
                "res.config.settings",
                "set_values",
                [settingsId]
            );
        }
        //save current step in database

    }

    /**
     * Move to the previous step
     */
    previousStep() {
        if (this.state.current_step > 0) {
            this.state.current_step--;
        }
    }

    /**
     * Navigate to a specific step
     */
    goToStep(stepNumber) {
        console.log(this.state)
        if (stepNumber >= 0 && stepNumber <= 6) {
            this.state.current_step = stepNumber;
        }
    }

    /**
     * Skip the wizard
     */
    async skipWizard() {
        console.log("Wizard skipped");
        this.state.showWizard = false;

        //save in database that user skipped the wizard
        const settingsId = await this.orm.create(
            "res.config.settings",
            [
                {
                    onboarding_wizard_skipped: true,
                }
            ]
        );
        await this.orm.call(
            "res.config.settings",
            "set_values",
            [settingsId]
        );
        // // Add logic to close wizard or mark as skipped
    }

    /**
     * Complete the wizard
     */
    completeWizard() {
        console.log("Wizard completed");
        this.state.current_step = 5;

        // Add logic to save completion status
        this.orm.call("res.config.settings", "set_values", [{
            onboarding_wizard_completed: true,
        }]);
    }

    /**
     * Close the wizard modal
     */
    closeWizard() {
        console.log("Wizard closed by user");
        // Hide the modal or reset state
        this.state.showWizard = false;
        // You can also add logic to save progress before closing
    }
    /**
     * s
     */
}