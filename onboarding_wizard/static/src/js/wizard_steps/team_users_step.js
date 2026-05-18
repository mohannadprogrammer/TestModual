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
        this.action = useService("action");


        this.state = useState({
            activeTab: "departments", // tabs: departments, employees, users
            employees: [],
            departments: [],
            users: [],
            roles: [],
            newEmployee: {
                name: "",
                email: "",
                job_title: "",
                department_id: null,
                role_ids: [],
                isNew: true, // flag to identify new employees
            },
            newDepartment: {
                name: "",
                isNew: true,
            },
            newUser: {
                login: "",
                name: "",
                email: "",
                isNew: true,
            },
        });

        this.loadInitialData();
    }
    async openEmployeeForm() {
        await this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "hr.employee",
            views: [[false, "form"]],
            target: "new",
        },
            {
                onClose: async () => {
                    console.log("Employee form closed");

                    const employees = await this.orm.searchRead(
                        "hr.employee",
                        [],
                        []
                    );

                    this.state.employees = employees;

                    console.log("Employees reloaded:", employees);
                }
            }

        );
    }

    async openDepartmentForm() {
        await this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "hr.department",
            views: [[false, "form"]],
            target: "new",
        },
            {
                onClose: async () => {
                    console.log("Department form closed");

                    const departments = await this.orm.searchRead(
                        "hr.department",
                        [],
                        []
                    );

                    this.state.departments = departments;

                    console.log("Departments reloaded:", departments);
                }
            }

        );
    }

    async openUserForm() {
        // Create department first
        const action = await this.action.loadAction("base.action_res_users");
        console.log("Loaded action:", action);

        const viewId = await this.orm.call(
            "ir.model.data",
            "check_object_reference",
            ["base", "view_users_form"]
        );

        console.log("sdksldflksdlfk", viewId);
        action.views = [[viewId[1], "form"]];
        action.target = "new";

        await this.action.doAction(action, {
            onClose: async () => {
                console.log("Users popup closed");
            },
        });
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

            // Load existing users
            const users = await this.orm.searchRead(
                "res.users",
                [],
                []
            );

            this.state.employees = employees;
            this.state.departments = departments;
            this.state.roles = roles;
            this.state.users = users;

            // console.log("Departments loaded:", this.state.departments);
            // console.log("Roles loaded:", this.state.roles);
            console.log("Employees loaded:", this.state.employees);
            console.log("Users loaded:", this.state.users);

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
                isNew: true, // flag to identify new employees
            };

            //save
        }
    }

    saveAllNewData() {
        // Filter new items
        const newDepartments = this.state.departments.filter(dept => dept.isNew === true);
        const newEmployees = this.state.employees.filter(emp => emp.isNew === true);
        const newUsers = this.state.users.filter(user => user.isNew === true);

        console.log("New departments to save:", newDepartments);
        console.log("New employees to save:", newEmployees);
        console.log("New users to save:", newUsers);

        // Create promises for all saves
        const allPromises = [];

        // Save departments
        const departmentPromises = newDepartments.map(dept => {
            return this.orm.create("hr.department", [{
                name: dept.name,
            }]);
        });
        allPromises.push(...departmentPromises);

        // Save employees
        const employeePromises = newEmployees.map(emp => {
            return this.orm.create("hr.employee", [{
                name: emp.name,
                work_email: emp.email,
                job_title: emp.job_title,
                department_id: emp.department_id ? parseInt(emp.department_id) : null,
            }]);
        });
        allPromises.push(...employeePromises);

        // Save users
        const userPromises = newUsers.map(user => {
            return this.orm.create("res.users", [{
                login: user.login,
                name: user.name,
                email: user.email,
            }]);
        });
        allPromises.push(...userPromises);

        // Execute all promises
        Promise.all(allPromises)
            .then(() => {
                console.log("All data saved successfully!");
                console.log("Departments saved:", newDepartments.length);
                console.log("Employees saved:", newEmployees.length);
                console.log("Users saved:", newUsers.length);
                this.props.onNext();
            })
            .catch(error => {
                console.error("Error saving data:", error);
            });
    }
    removeEmployee(id) {
        this.state.employees = this.state.employees.filter(emp => emp.id !== id);
    }

    addDepartment() {
        const department = this.state.newDepartment;

        if (department.name) {
            this.state.departments.push({
                ...department,
                id: Date.now(), // simple id generation
            });

            // Reset form
            this.state.newDepartment = {
                name: "",
                isNew: true,
            };
        }
    }

    removeDepartment(id) {
        this.state.departments = this.state.departments.filter(dept => dept.id !== id);
    }

    addUser() {
        const user = this.state.newUser;

        if (user.login && user.name && user.email) {
            this.state.users.push({
                ...user,
                id: Date.now(), // simple id generation
            });

            // Reset form
            this.state.newUser = {
                login: "",
                name: "",
                email: "",
                isNew: true,
            };
        }
    }

    removeUser(id) {
        this.state.users = this.state.users.filter(user => user.id !== id);
    }
}