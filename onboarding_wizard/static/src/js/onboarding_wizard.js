

import { Component, onMounted, onWillStart, useExternalListener, useState } from "@odoo/owl";
import {
    WelcomeStep,
    CompanyInfoStep,
    BusinessActivityStep,
    TeamUsersStep,
    AccountingConfigStep,
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
        FinalStep
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            current_step: 3,
            completion_score: 0,
            total_users_created: 0,
            companyInfo: {},
            accountingConfig: {},
            countries: [],
            currencies: [],
            showWizard: true,
        });
        this.loadInitialData();
    }
    async loadInitialData() {
        try {
            const countries = await this.orm.call("res.country", "search_read", [[], ["name"]]);
            const currencies = await this.orm.call("res.currency", "search_read", [[], ["name"]]);
            // company info from database if exists
            const companyInfo = await this.orm.call("res.company", "search_read", [[], []]);
            this.state.countries = countries;
            this.state.currencies = currencies;
            this.state.companyInfo = companyInfo[0] || {};
            // Load accounting configuration if exists
            if (companyInfo[0] && companyInfo[0].accounting_config) {
                try {
                    this.state.accountingConfig = JSON.parse(companyInfo[0].accounting_config);
                } catch (e) {
                    console.warn("Could not parse accounting config:", e);
                }
            }
            console.log("Company info loaded:", this.state.companyInfo);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }
    /**
     * Move to the next step
     */
    nextStep() {
        if (this.state.current_step < 5) {
            this.state.current_step++;
        }
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
        if (stepNumber >= 0 && stepNumber <= 5) {
            this.state.current_step = stepNumber;
        }
    }

    /**
     * Skip the wizard
     */
    skipWizard() {
        console.log("Wizard skipped");
        // Add logic to close wizard or mark as skipped
    }

    /**
     * Complete the wizard
     */
    completeWizard() {
        console.log("Wizard completed");
        this.state.current_step = 5;
        // Add logic to save completion status
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
}