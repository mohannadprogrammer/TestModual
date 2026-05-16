import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class TeamUsersStep extends Component {
    static template = "onboarding_wizard.TeamUsersStep";

    static props = {
        onNext: Function,
        onPrevious: Function,
        formData: { type: Object, optional: true },
        errors: { type: Object, optional: true },
    };

    setup() {
        this.orm = useService("orm");

        this.state = useState({
            employees: [],
            departments: [],
            roles: [],
            newEmployee: {
                name: "",
                email: "",
                job_title: "",
                department_id: null,
                role_ids: [],
            },
        });

        this.loadInitialData();
    }

    async loadInitialData() {
        try {
            // Load Departments
            const departments = await this.orm.searchRead(
                "hr.department",
                [],
                []
            );

            // Load Roles / Groups
            const roles = await this.orm.searchRead(
                "res.groups",
                [],
                []
            );
            //load existing employees if any
            const employees = await this.orm.searchRead(
                "hr.employee",
                [],
                []
            );
            this.state.employees = employees;

            this.state.departments = departments;
            this.state.roles = roles;

            // console.log("Departments loaded:", this.state.departments);
            // console.log("Roles loaded:", this.state.roles);
            console.log("Employees loaded:", this.state.employees);

        } catch (error) {
            console.error("Error loading HR data:", error);
        }
    }

    addEmployee() {
        const employee = this.state.newEmployee;

        if (employee.name && employee.email) {

            this.state.employees.push({
                ...employee,
            });

            // Reset form
            this.state.newEmployee = {
                id: this.state.employees.length + 1, // simple id generation
                name: "",
                email: "",
                job_title: "",
                department_id: null,
                role_ids: [],
            };
        }
    }

    removeEmployee(id) {
        this.state.employees = this.state.employees.filter(emp => emp.id !== id);
    }
}