const inquirer = require("inquirer");
const mysql = require("mysql");

const {config} = require("./creds/creds")
const connection = mysql.createConnection(config);

//.. Add Employee function

addEmployee();

//.. Update Employee Info function

updateInfo();

//.. Add role function

addRole();

//.. Add department function

addDepartment();

//.. View all employees function

viewAllEmployees();

//.. View employess by role function

viewAllRoles();

//.. View employees by department function

viewAllDepartments();








//.. Main menu to give user options

function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "Please choose an option",
    name: "action",
    choices: [
            "Add Employee",
            "Update Employee Info",
            "Add Role",
            "Add Department",
            "View All Employees", 
            "View All Employees By Roles",
            "View all Employees By Deparments"
            ]
    }
]).then(function(val) {
        switch (val.action) {
            case "Add Employee":
                    addEmployee();
                break;
            case "Update Employee Info":
                    updateInfo();
                break;
            case "Add Role":
                    addRole();
                break;
            case "Add Department":
                    addDepartment();
                break;
            case "View All Employees":
                    viewAllEmployees();
                break;
    
          case "View All Employees By Roles":
                    viewAllRoles();
                break;
          case "View all Employees By Deparments":
                    viewAllDepartments();
                break;
    
            }
    })
}




startPrompt();