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
        this.action = useService("action");
        this.state = useState({
            chartOfAccounts: false,
            zatcaApi: "sandbox",
            paymentMethods: [],
            bankAccounts: this.props.accountingConfig?.bank_accounts || [],
            newPaymentMethod: { name: "", code: "" },
            newBankAccount: { name: "", account_number: "", bank_name: "", currency_id: "" },
            currencies: [],
            countries: [],
            currentlocalization: null,
        });
        this.loadInitialData();
    }
    async openChartOfAccounts() {
        try {
            await this.action.doAction({
                type: "ir.actions.act_window",
                res_model: "account.account",
                views: [[false, "list"]],
                target: "new",
            });
            this.state.chartOfAccounts = true;
        } catch (error) {
            console.error("Error opening Chart of Accounts:", error);
        }
    }
    async loadInitialData() {
        try {
            const currencies = await this.orm.call("res.currency", "search_read", [[], ["name", "symbol"]]);
            const countries = await this.orm.call("res.country", "search_read", [[], ["name", "code"]]);
            const fiscal = await this.orm.call("res.config.settings", "get_values", []);
            this.state.currencies = currencies;
            this.state.countries = countries;
            this.state.currentlocalization = fiscal.account_fiscal_country_id || "";
            this.state.zatcaApi = fiscal.l10n_sa_api_model || "sandbox";
            console.log(fiscal, "fiscal");

            const bankAccounts = await this.orm.searchRead(
                "account.account",
                [["account_type", "=", "asset_cash"]],
                []
            );
            const paymentMethods = await this.orm.searchRead(
                "payment.method",
                [],
                ["name", "code"]
            );

            this.state.paymentMethods = paymentMethods;


            this.state.bankAccounts = bankAccounts;
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    }

    handleInputChange(field, value) {

        this.state[field] = value;

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

    async removePaymentMethod(id) {
        const index = this.state.paymentMethods.findIndex((pm) => pm.id === id);
        await this.orm.call(
            "payment.method",
            "unlink",
            [[id]]
        );
        if (index > -1) {
            this.state.paymentMethods.splice(index, 1);
        }
    }

    addPaymentMethodInAction() {
        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "payment.method",
            views: [[false, "form"]],
            context: {
                default_payment_type: "inbound",
            },
            target: "new",
        },
            {
                onClose: async () => {
                    console.log("Payment method form closed");

                    const paymentMethods = await this.orm.searchRead(
                        "payment.method",
                        [],
                        ["name", "code"]
                    );

                    this.state.paymentMethods = paymentMethods;

                    console.log("Payment methods reloaded:", this.state.paymentMethods);
                }
            }
        );
    }

    addBankAccountinAction() {
        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "account.account",
            views: [[false, "form"]],
            context: {
                default_account_type: "asset_cash",
            },
            target: "new",
        },
            {
                onClose: async () => {
                    console.log("Bank account form closed");

                    const bankAccounts = await this.orm.searchRead(
                        "account.account",
                        [["account_type", "=", "asset_cash"]],
                        []
                    );

                    this.state.bankAccounts = bankAccounts;

                    console.log("Bank accounts reloaded:", "bankAccounts");
                }
            }

        );
    }
    addBankAccount() {

        // if (this.state.newBankAccount.name && this.state.newBankAccount.account_number) {
        //     this.state.bankAccounts.push({
        //         id: Date.now(),
        //         ...this.state.newBankAccount,
        //     });
        //     this.state.newBankAccount = { name: "", account_number: "", bank_name: "", currency_id: "" };
        // }
    }

    async removeBankAccount(id) {
        const index = this.state.bankAccounts.findIndex((ba) => ba.id === id);
        await this.orm.call(
            "account.account",
            "unlink",
            [[id]]
        );
        if (index > -1) {
            this.state.bankAccounts.splice(index, 1);
        }
    }
    async saveSettings() {
        console.log("Saving settings with fiscal localization:", this.state.zatcaApi);
        await this.orm.call(
            "res.config.settings",
            "save_onboarding_settings",
            [{

                account_fiscal_country_id: parseInt(this.state.currentlocalization),
                l10n_sa_api_model: this.state.zatcaApi,
            }]
        );


    }


}
