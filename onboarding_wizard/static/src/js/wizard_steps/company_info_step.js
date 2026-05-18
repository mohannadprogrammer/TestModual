import { Component, useState, useRef, onWillStart } from "@odoo/owl";
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
        onWillStart(async () => {
            await this.loadInitialData();
        });
    }

    async loadInitialData() {
        try {

            const countries = await this.orm.call("res.country", "search_read", [[], ["name"]]);
            const currencies = await this.orm.call("res.currency", "search_read", [[], ["name"]]);
            // company info from database if exists
            const companyInfo = await this.orm.call("res.company", "search_read", [[], ["name", "street", "street2", "city", "country_id", "currency_id", "vat", "logo"]]);
            this.state.countries = countries;
            this.state.currencies = currencies;
            this.state.companyInfo = companyInfo[0] || {};
            this.state.companyInfo.logo = 'data:image/png;base64,' + this.state.companyInfo.logo;
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

    handleInputChange = (field, value) => {

        this.state.companyInfo[field] = value;
        console.log("Updated companyInfo:", this.state.companyInfo);
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File loaded:", e.target);
                this.state.companyInfo.logo = e.target.result;
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
                name: this.state.companyInfo.name,
                street: this.state.companyInfo.street,
                street2: this.state.companyInfo.street2,
                city: this.state.companyInfo.city,
                country_id: parseInt(this.state.companyInfo.country_id) || null,
                currency_id: parseInt(this.state.companyInfo.currency_id) || null,
                vat: this.state.companyInfo.vat,
                logo: this.state.companyInfo.logo
                    ?.split(",")[1] || null, // Remove the data URL prefix

            };

            // update to res.company
            const companyId = await this.orm.write("res.company", [this.state.companyInfo.id], companyData);
            console.log("Company updated with ID:", companyId);
            this.props.onNext();
            return companyId;
        } catch (error) {
            console.error("Error saving company info:", error);
            throw error;
        }

    }
}
