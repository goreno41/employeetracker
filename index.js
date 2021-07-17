const inquirer = require("inquirer");
const mysql = require("mysql");

const {config} = require("./creds/creds")
const connection = mysql.createConnection(config);

//.. Add Employee function

const addEmployee = () => { 
    inquirer.prompt([
        {
            type: "input",
            message: "What is their first name?",
            name: "firstname"
        },
        {
            type: "input",
            message: "What is their last name?",
            name: "lastname"
        },
        {
            type: "list",
            message: "What is their role? ",
            choices: roleOptions(),
            name: "role"
        },
        {
            type: "list",
            message: "Whats their managers name?",
            choices: selectManager(),
            name: "manager"
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.manager) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}

//.. Role options function within add employee

var rolesList = [];
function roleOptions() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rolesList.push(res[i].name);
    }

  })
  return rolesList;
}

//.. Select manager function within add employee

var managersList = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersList.push(res[i].first_name);
    }

  })
  return managersList;
}

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