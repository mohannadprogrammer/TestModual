import { Component, useState, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
export class CompanyInfoStep extends Component {
    static template = "onboarding_wizard.CompanyInfoStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        companyInfo: { type: Object, optional: true },
        countries: { type: Array, optional: true },
        currencies: { type: Array, optional: true },
        updateFormData: Function,
        errors: { type: Object, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            logoPreview: this.props.companyInfo.logo || null,
        });
        this.logoInput = useRef("logoInput");
        console.log("state", this.state);
    }



    handleInputChange(field, value) {
        if (this.props.updateFormData) {
            this.props.updateFormData({ [field]: value });
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    openFileDialog() {
        this.logoInput.el.click();
    }

    async saveCompanyInfo() {
        try {
            const companyData = {
                name: this.props.companyInfo.name,
                street: this.props.companyInfo.street,
                street2: this.props.companyInfo.street2,
                city: this.props.companyInfo.city,
                country_id: this.props.companyInfo.country_id,
                currency_id: this.props.companyInfo.currency_id,
                tz: this.props.companyInfo.tz,
                vat: this.props.companyInfo.vat,
            };

            // Save to res.company
            const companyId = await this.orm.create("res.company", [companyData]);
            console.log("Company created with ID:", companyId);
            return companyId;
        } catch (error) {
            console.error("Error saving company info:", error);
            throw error;
        }
    }
}
