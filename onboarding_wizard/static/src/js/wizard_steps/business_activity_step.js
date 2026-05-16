import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class BusinessActivityStep extends Component {
    static template = "onboarding_wizard.BusinessActivityStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: { type: Object, optional: true },
        updateFormData: Function,
        errors: { type: Object, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            selectedType: null,
            recommendedModules: [],
            loading: true,
            businessTypes: [],
        });

        onWillStart(async () => {
            await this.loadBusinessTypes();
        });
    }

    async loadBusinessTypes() {
        try {
            this.state.loading = true;
            const businessTypes = await this.orm.searchRead("business.type", [], []);
            this.state.businessTypes = businessTypes;
            console.log("Business types loaded:", this.state.businessTypes);

        } catch (error) {
            console.error("Error loading business types:", error);
        } finally {
            this.state.loading = false;
        }
    }

    async selectBusinessType(typeId) {
        this.state.selectedType = typeId;
        const selectedType = this.state.businessTypes.find(type => type.id === typeId);
        if (this.props.updateFormData) {
            this.props.updateFormData({ businessType: selectedType });
        }
        //update recommended modules based on selected business type
        console.log("Selected business type:", selectedType);
        const moduleIds = selectedType ? selectedType.recommended_modules : [];

        const modules = await this.orm.read(
            'ir.module.module',
            moduleIds,
            []
        );

        console.log("modosoos skdfkskdfk #####", modules);
        this.state.recommendedModules = selectedType ? modules : [];
        console.log("$$$$$$$$$$$44444", this.state.recommendedModules);
    }
    //install recommended modules
    async installRecommendedModules() {
        const validModules = (this.state.recommendedModules || []).filter(
            (mod) => mod && mod.id
        );

        if (!validModules.length) {
            return;
        }

        try {
            const moduleIds = validModules.map((mod) => mod.id);

            await this.orm.call(
                'ir.module.module',
                'button_immediate_install',
                [moduleIds]
            );

            console.log(
                "Recommended modules installation triggered for IDs:",
                moduleIds
            );

        } catch (error) {
            console.error(
                "Error installing recommended modules:",
                error
            );
        }
    }
}
