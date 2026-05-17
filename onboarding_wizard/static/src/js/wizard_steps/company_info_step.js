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
        this.logoInput = useRef("logoInput");

        this.state = useState({
            companyInfo: {},
            accountingConfig: {},
            countries: [],
            currencies: [],
            logoPreview: null,
            currency_id: [],
        });

        console.log("CompanyInfoStep state", this.props);

        console.log("state", this.state);
        this.loadInitialData();
    }

    async loadInitialData() {
        try {

            const countries = await this.orm.call("res.country", "search_read", [[], ["name"]]);
            const currencies = await this.orm.call("res.currency", "search_read", [[], ["name"]]);
            // company info from database if exists
            const companyInfo = await this.orm.call("res.company", "search_read", [[], []]);
            this.state.countries = countries;
            this.state.currencies = currencies;
            this.state.companyInfo = companyInfo[0] || {};
            this.state.loadInitialData = companyInfo[0]?.logo || null;
            this.state.currency_id = companyInfo[0]?.currency_id || "";

            // // Load accounting configuration if exists
            // if (companyInfo[0] && companyInfo[0].accounting_config) {
            //     try {
            //         this.state.accountingConfig = JSON.parse(companyInfo[0].accounting_config);
            //     } catch (e) {
            //         console.warn("Could not parse accounting config:", e);
            //     }
            // }
            // console.log("&&&&&&&&&&&&&&&&&&&&&", this.state.companyInfo);
        } catch (error) {
            console.error("Error loading data:", error);
        }
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
