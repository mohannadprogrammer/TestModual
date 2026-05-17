/** @odoo-module **/

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";
console.log("Learning Popup Service Loaded");
export const popupState = reactive({
    visible: false,
    minimized: false,

    content: {
        title: "",
        description: "",
        video_url: "",
    },
});

export const learningPopupService = {

    start() {

        return {

            state: popupState,

            show(content) {

                popupState.visible = true;
                popupState.minimized = false; // Start minimized
                popupState.content = content;
            },

            hide() {
                popupState.visible = false;
            },

            minimize() {
                popupState.minimized = true;
            },

            expand() {
                popupState.minimized = false;
            },
        };
    },
};

registry.category("services").add(
    "learning_popup",
    learningPopupService
);