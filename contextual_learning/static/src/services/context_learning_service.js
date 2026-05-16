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
        const updateContext = async () => {

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

                console.log("Learning Context Updated:", learningContext.currentModel);
                //update the popup service with new content based on the context
                const popup = env.services.learning_popup;

                const content = await orm.searchRead(
                    "learning.content",
                    [["model.model", "=", learningContext.currentModel]],
                    ["model_name", "model", "view_type", "display_name", "description", "url"]
                ).then((contents) => {
                    console.log("###########", contents);
                    if (contents.length > 0) {
                        const content = contents[0];
                        popup.show({
                            title: content.display_name,
                            description: content.description,
                            video_url: convertYoutubeUrl(content.url),
                        });

                        return content;
                        // console.log("Showing learning popup for content:", content);
                    } else {
                        popup.hide();
                        // console.log("No learning content found for current context.");
                        return [];
                    }
                }).catch((error) => {
                    console.error("Error loading learning content:", error);
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
         * Initial context detection
         */
        await setTimeout(updateContext, 300);
        /**
         * read from database model  learing.content and show popup if there is any content with current context
         */




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