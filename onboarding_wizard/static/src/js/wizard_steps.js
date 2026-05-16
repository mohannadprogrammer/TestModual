import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
console.log("wizard steps loaded")
// Step 1: Welcome Screen
// export class WelcomeStep extends Component {
//     static template = "onboarding_wizard.WelcomeStep";
//     static props = {
//         onNext: Function,
//         onSkip: Function,
//         estimatedDuration: { type: Number, optional: true },
//     };

//     setup() {
//         this.state = useState({
//             agreeToTerms: false,
//         });
//     }

//     handleNext() {
//         if (this.state.agreeToTerms) {
//             this.props.onNext();
//         }
//     }
// }

// Step 2: Company Information
export class CompanyInfoStep extends Component {
    static template = "onboarding_wizard.CompanyInfoStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: Object,
        updateFormData: Function,
        errors: Object,
    };

    setup() {
        // this.rpc = useService("rpc");
        this.state = useState({
            countries: [],
            currencies: [],
            logoPreview: null,
        });

        // this.loadInitialData();
    }

    async loadInitialData() {
        try {
            // Load countries and currencies from database
            const countries = await rpc("/web/dataset/call_kw", {
                model: "res.country",
                method: "search_read",
                args: [[], ["id", "name", "code"]],
                kwargs: { limit: 250 },
            });
            this.state.countries = countries;
        } catch (error) {
            console.error("Error loading countries:", error);
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.logoPreview = e.target.result;
                this.props.updateFormData("company_logo", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    handleInputChange(field, value) {
        this.props.updateFormData(field, value);
    }

    validateStep() {
        return this.props.formData?.company_name || "";
    }
}

// Step 3: Business Activity Selection
export class BusinessActivityStep extends Component {
    static template = "onboarding_wizard.BusinessActivityStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: Object,
        updateFormData: Function,
        errors: Object,
    };

    setup() {
        this.rpc = useService("rpc");
        this.notification = useService("notification");

        this.businessTypes = [
            { id: "retail", name: "Retail", icon: "🛒" },
            { id: "manufacturing", name: "Manufacturing", icon: "🏭" },
            { id: "services", name: "Services", icon: "🔧" },
            { id: "restaurant", name: "Restaurant", icon: "🍽️" },
            { id: "healthcare", name: "Healthcare", icon: "🏥" },
            { id: "education", name: "Education", icon: "🎓" },
            { id: "ecommerce", name: "E-commerce", icon: "🌐" },
        ];

        this.state = useState({
            selectedType: this.props.formData?.business_type || null,
            recommendedModules: [],
            loading: false,
        });
    }

    async selectBusinessType(businessType) {
        this.state.selectedType = businessType;
        this.props.updateFormData("business_type", businessType);

        try {
            this.state.loading = true;
            const response = await this.rpc(
                "/onboarding/modules/recommended",
                { business_type: businessType }
            );
            this.state.recommendedModules = response.modules;
        } catch (error) {
            this.notification.add(
                "Error loading modules: " + error.message,
                { type: "danger" }
            );
        } finally {
            this.state.loading = false;
        }
    }
}

// Step 4: Team & Users
export class TeamUsersStep extends Component {
    static template = "onboarding_wizard.TeamUsersStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: Object,
        updateFormData: Function,
        errors: Object,
    };

    setup() {
        this.rpc = useService("rpc");
        this.notification = useService("notification");

        this.state = useState({
            employees: this.props.formData?.employees || [],
            departments: this.props.formData?.departments || [],
            roles: [],
            newEmployee: {
                name: "",
                email: "",
                job_title: "",
                department_id: null,
                role_ids: [],
            },
        });

        this.loadRoles();
    }

    async loadRoles() {
        try {
            const roles = await this.rpc("/web/dataset/call_kw", {
                model: "res.groups",
                method: "search_read",
                args: [[], ["id", "name"]],
                kwargs: { limit: 100 },
            });
            this.state.roles = roles;
        } catch (error) {
            console.error("Error loading roles:", error);
        }
    }

    addEmployee() {
        if (this._validateEmployee()) {
            this.state.employees.push({ ...this.state.newEmployee });
            this.state.newEmployee = {
                name: "",
                email: "",
                job_title: "",
                department_id: null,
                role_ids: [],
            };
            this.props.updateFormData("employees", this.state.employees);
        }
    }

    removeEmployee(index) {
        this.state.employees.splice(index, 1);
        this.props.updateFormData("employees", this.state.employees);
    }

    _validateEmployee() {
        if (!this.state.newEmployee.name) {
            this.notification.add("Employee name is required", {
                type: "warning",
            });
            return false;
        }
        if (!this.state.newEmployee.email) {
            this.notification.add("Email is required", {
                type: "warning",
            });
            return false;
        }
        return true;
    }

    addDepartment(departmentName) {
        if (departmentName) {
            this.state.departments.push({
                id: Date.now(),
                name: departmentName,
            });
            this.props.updateFormData("departments", this.state.departments);
        }
    }
}

// Step 5: Accounting Configuration
export class AccountingStep extends Component {
    static template = "onboarding_wizard.AccountingStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: Object,
        updateFormData: Function,
        errors: Object,
    };

    setup() {
        this.state = useState({
            chart: "",
            fiscalYearStart: null,
            bankAccounts: this.props.formData?.bankAccounts || [],
            paymentMethods: [],
        });
    }

    addBankAccount(bank) {
        this.state.bankAccounts.push(bank);
        this.props.updateFormData("bankAccounts", this.state.bankAccounts);
    }

    removeBankAccount(index) {
        this.state.bankAccounts.splice(index, 1);
        this.props.updateFormData("bankAccounts", this.state.bankAccounts);
    }
}

// Step 6: Workflow Preferences
export class WorkflowStep extends Component {
    static template = "onboarding_wizard.WorkflowStep";
    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: Object,
        updateFormData: Function,
        errors: Object,
    };

    setup() {
        this.layoutTemplates = [
            {
                id: "modern",
                name: "Modern",
                description: "Clean and contemporary design",
                preview: "🎨",
            },
            {
                id: "classic",
                name: "Classic",
                description: "Traditional Odoo interface",
                preview: "📋",
            },
            {
                id: "minimal",
                name: "Minimal",
                description: "Simplified and focused interface",
                preview: "📱",
            },
        ];

        this.state = useState({
            selectedTemplate:
                this.props.formData?.layoutTemplate || "modern",
        });
    }

    selectTemplate(templateId) {
        this.state.selectedTemplate = templateId;
        this.props.updateFormData("layoutTemplate", templateId);
    }
}

// Step 7: Final Dashboard
export class FinalDashboardStep extends Component {
    static template = "onboarding_wizard.FinalDashboardStep";
    static props = {
        onComplete: Function,
        wizardId: Number,
        completionScore: Number,
        totalUsers: Number,
        installedModules: Number,
        emailStatus: String,
    };

    setup() {
        this.rpc = useService("rpc");

        this.state = useState({
            stats: {
                completionScore: this.props.completionScore || 0,
                totalUsers: this.props.totalUsers || 0,
                installedModules: this.props.installedModules || 0,
                emailStatus: this.props.emailStatus || "not_configured",
            },
        });

        this.loadDashboardStats();
    }

    async loadDashboardStats() {
        try {
            const stats = await this.rpc("/onboarding/dashboard", {
                wizard_id: this.props.wizardId,
            });
            this.state.stats = stats;
        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        }
    }

    getCompletionMessage() {
        const score = this.state.stats.completionScore;
        if (score >= 90) return "🎉 Excellent! Setup is almost complete!";
        if (score >= 75) return "✅ Great! You've completed most of the setup!";
        if (score >= 50) return "⏳ Good progress! Continue to complete your setup!";
        return "👋 You're on your way! Keep going!";
    }
}
