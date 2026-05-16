/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class LearningPopup extends Component {

    static template =
        "contextual_learning.LearningPopup";

    setup() {

        this.popupService =
            useService("learning_popup");
        this.contextService =
            useService("contextual_learning");
        this.orm = useService("orm");

        /**
         * Bind methods
         */
        this.state = useState(this.popupService.state);


    }

    closePopup = () => {
        // console.log("Closing popup:", this);
        console.log("Popup state:", this.state);
        this.popupService.hide();
    }

    minimizePopup = () => {
        console.log("Minimizing popup:", this);
        this.popupService.minimize();
    }

    expandPopup = () => {
        console.log("Expanding popup:", this);
        this.popupService.expand();
    }


}