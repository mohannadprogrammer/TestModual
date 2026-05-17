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
