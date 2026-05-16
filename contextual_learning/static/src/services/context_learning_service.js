/** @odoo-module **/

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

/**
 * Context Learning Service
 * Detects the current Odoo context dynamically
 */

export const learningContext = reactive({
    currentModel: null,
    currentViewType: null,
    currentActionId: null,
    currentMenuId: null,
    currentResId: null,
});

export const contextualLearningService = {
    dependencies: ["action", "orm"],

    async start(env, services) {
        const { action, orm } = services;
        const convertYoutubeUrl = (url) => {

            if (!url) {
                return "";
            }

            // watch?v=
            if (url.includes("watch?v=")) {

                const videoId =
                    url.split("watch?v=")[1];

                return `https://www.youtube.com/embed/${videoId}`;
            }

            return url;
        }
        /**
         * Extract current context from action manager
         */
        const updateContext = () => {

            try {

                const controller = action.currentController?.action;
                const props = action.currentController?.props;
                if (!controller) {
                    return;
                }
                const actionData = controller || {};

                learningContext.currentModel =
                    props.resModel ||
                    actionData.res_model ||
                    null;

                learningContext.currentViewType =
                    props.type ||
                    actionData.view_mode ||
                    null;

                learningContext.currentActionId =
                    actionData.id ||
                    null;

                learningContext.currentResId =
                    props.resId ||
                    null;

                learningContext.currentMenuId =
                    null;

                console.log("Learning Context Updated:", {
                    model: learningContext.currentModel,
                    view: learningContext.currentViewType,
                    action: learningContext.currentActionId,
                    menu: learningContext.currentMenuId,
                    resId: learningContext.currentResId,
                });

            } catch (error) {

                console.error(
                    "Error updating contextual learning state:",
                    error
                );
            }
        };

        /**
         * Listen for action changes
         */
        env.bus.addEventListener("ACTION_MANAGER:UI-UPDATED", updateContext);

        /**
         * read from database model  learing.content and show popup if there is any content with current context
         */
        const popup = env.services.learning_popup;
        const content = await orm.searchRead("learning.content", [
        ], []).then((contents) => {
            console.log("Learning contents for current context:", contents);
            if (contents.length > 0) {
                const content = contents[0];



                return content;
                // console.log("Showing learning popup for content:", content);
            }
        }).catch((error) => {
            console.error("Error loading learning content:", error);
        });
        console.log("Contentttttttttttttt", content);
        popup.show({
            title: content.display_name,
            description: content.description,
            video_url: convertYoutubeUrl(content.url),
        });

        /**
         * Initial context detection
         */
        setTimeout(updateContext, 0);

        return {
            context: learningContext,
            refresh: updateContext,
        };
    },

};

registry.category("services").add(
    "contextual_learning",
    contextualLearningService
);