
import { startWebClient } from "@web/start";
import { WebClientOnboarding } from "./webclient";

/**
 * This file starts the onboarding webclient. In the manifest, it replaces
 * the community main.js to load a different webclient class
 * (WebClientOnboarding instead of WebClient)
 */
startWebClient(WebClientOnboarding);
