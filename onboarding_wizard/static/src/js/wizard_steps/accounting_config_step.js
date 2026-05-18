import { Component, useState, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";

export class AccountingConfigStep extends Component {
    static template = "onboarding_wizard.AccountingConfigStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        accountingConfig: { type: Object, optional: true },
        countries: { type: Array, optional: true },
        updateFormData: Function,
        errors: { type: Object, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            fiscalLocalization: this.props.accountingConfig?.fiscal_localization || "",
            chartOfAccounts: this.props.accountingConfig?.chart_of_accounts || "",
            zatcaEnabled: this.props.accountingConfig?.zatca_enabled || false,
            zatcaApiUrl: this.props.accountingConfig?.zatca_api_url || "",
            zatcaApiKey: this.props.accountingConfig?.zatca_api_key || "",
            paymentMethods: this.props.accountingConfig?.payment_methods || [],
            bankAccounts: this.props.accountingConfig?.bank_accounts || [],
            newPaymentMethod: { name: "", code: "" },
            newBankAccount: { name: "", account_number: "", bank_name: "", currency_id: "" },
            currencies: [],
            countries: [],
        });
        this.loadInitialData();
    }

    async loadInitialData() {
        try {
            const currencies = await this.orm.call("res.currency", "search_read", [[], ["name", "symbol"]]);
            const countries = await this.orm.call("res.country", "search_read", [[], ["name", "code"]]);
            this.state.currencies = currencies;
            this.state.countries = countries;
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    }

    handleInputChange(field, value) {
        if (field.startsWith("zatca_")) {
            const zatcaField = field.replace("zatca_", "");
            this.state[zatcaField] = value;
        } else {
            this.state[field] = value;
        }
    }

    toggleZATCA() {
        this.state.zatcaEnabled = !this.state.zatcaEnabled;
    }

    addPaymentMethod() {
        if (this.state.newPaymentMethod.name && this.state.newPaymentMethod.code) {
            this.state.paymentMethods.push({
                id: Date.now(),
                ...this.state.newPaymentMethod,
            });
            this.state.newPaymentMethod = { name: "", code: "" };
        }
    }

    removePaymentMethod(id) {
        const index = this.state.paymentMethods.findIndex((pm) => pm.id === id);
        if (index > -1) {
            this.state.paymentMethods.splice(index, 1);
        }
    }

    addBankAccount() {
        if (this.state.newBankAccount.name && this.state.newBankAccount.account_number) {
            this.state.bankAccounts.push({
                id: Date.now(),
                ...this.state.newBankAccount,
            });
            this.state.newBankAccount = { name: "", account_number: "", bank_name: "", currency_id: "" };
        }
    }

    removeBankAccount(id) {
        const index = this.state.bankAccounts.findIndex((ba) => ba.id === id);
        if (index > -1) {
            this.state.bankAccounts.splice(index, 1);
        }
    }

    async saveAccountingConfig() {
        try {
            // Validate required fields
            if (!this.state.fiscalLocalization || !this.state.chartOfAccounts) {
                console.error("Fiscal localization and chart of accounts are required");
                return false;
            }

            // If ZATCA is enabled, validate ZATCA configuration
            if (this.state.zatcaEnabled) {
                if (!this.state.zatcaApiUrl || !this.state.zatcaApiKey) {
                    console.error("ZATCA API URL and API Key are required when ZATCA is enabled");
                    return false;
                }
            }

            const accountingData = {
                fiscal_localization: this.state.fiscalLocalization,
                chart_of_accounts: this.state.chartOfAccounts,
                zatca_enabled: this.state.zatcaEnabled,
                zatca_api_url: this.state.zatcaApiUrl,
                zatca_api_key: this.state.zatcaApiKey,
                payment_methods: this.state.paymentMethods,
                bank_accounts: this.state.bankAccounts,
            };

            // Save to account.config (or similar model)
            const result = await this.orm.call("res.company", "write", [
                [1],
                { accounting_config: JSON.stringify(accountingData) },
            ]);

            console.log("Accounting configuration saved:", accountingData);
            return true;
        } catch (error) {
            console.error("Error saving accounting config:", error);
            return false;
        }
    }
}
