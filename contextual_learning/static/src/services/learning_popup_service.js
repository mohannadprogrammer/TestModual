/** @odoo-module **/

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";


export const popupState = reactive({
    active: false,
    currentStepIndex: 0,
    steps: [],
});

export const tutorial_service = {
    startTutorial(steps) {
        this.state.steps = steps;
        this.state.active = true;
        this.state.currentStepIndex = 0;

        this.showStep();
    }
    ,
    showStep() {

        const step =
            this.state.steps[
            this.state.currentStepIndex
            ];

        const element =
            document.querySelector(
                step.target_selector
            );

        if (!element) {
            return;
        }

        element.classList.add(
            "learning-highlight"
        );

        this.state.currentStep = step;
    },
    nextStep() {

        const oldStep =
            this.state.steps[
            this.state.currentStepIndex
            ];

        const oldElement =
            document.querySelector(
                oldStep.target_selector
            );

        oldElement?.classList.remove(
            "learning-highlight"
        );

        this.state.currentStepIndex++;

        if (
            this.state.currentStepIndex >=
            this.state.steps.length
        ) {
            this.endTutorial();
            return;
        }

        this.showStep();
    }

};

registry.category("services").add(
    "learning_services",
    tutorial_service
);