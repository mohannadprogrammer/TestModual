import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
console.log("Welcome step loaded")

export class WelcomeStep extends Component {
    static template = "onboarding_wizard.WelcomeStep";
    static props = {
        onNext: Function,
        onSkip: Function,
        estimatedDuration: { type: Number, optional: true },
    };

    setup() {
        this.state = useState({
            agreeToTerms: false,
        });
    }

    handleNext() {
        if (this.state.agreeToTerms) {
            this.props.onNext();
        }
    }
}
