/** @odoo-module **/
import { WebClient } from "@web/webclient/webclient";
import { WebClientEnterprise } from "@web_enterprise/webclient/webclient";
import { OnboardingWizard } from "./onboarding_wizard"
console.log("webclient patched ")

export class WebClientOnboarding extends WebClientEnterprise {
    static template = "onboarding_wizard.WebClient";
    static components = {
        ...WebClientEnterprise.components,
        OnboardingWizard,
    };

}
