const inquirer = require("inquirer");
const mysql = require("mysql");

const {config} = require("./creds/creds")
const connection = mysql.createConnection(config);

//.. Role options function within add employee

var rolesList = [];
const roleOptions = () => {
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
const selectManager = () => {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersList.push(res[i].first_name);
    }

  })
  return managersList;
}

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
      var roleId = roleOptions().indexOf(val.role) + 1
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
          mainMenu()
      })

  })
}


//.. Update Employee Info function

const updateRole = () => {
    connection.query("SELECT employee.last_name, role.name FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
              type: "list",
              message: "What is the employee's last name?",
              choices: function() {
                  var lastName = [];
                  for (var i = 0; i < res.length; i++) {
                      lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                name: "lastName"
          },
          {
              type: "list",
              message: "What is the employee's new title?",
              choices: roleOptions(),
              name: "role"
          },
      ]).then(function(val) {
        var roleId = roleOptions().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            mainMenu()
        })
  
    });
  });

  }

//.. Add role function

const addRole = () => {
    connection.query("SELECT role.name AS name, role.salary AS salary FROM role",   function(err, res) {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the new role?",
                name: "name"
            },
            {
                type: "input",
                message: "What is the salary for the new role?",
                name: "salary"
    
            } 
        ]).then(function(res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                  name: res.name,
                  salary: res.salary,
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    mainMenu();
                }
            )
    
        });
      });

}

//.. Add department function

const addDepartment = () => {

}

//.. View all employees function

const viewAllEmployees = () => {

}

//.. View employess by role function

const viewAllRoles = () => {

}

//.. View employees by department function

const viewAllDepartments = () => {

}


//.. Main menu to give user options

const mainMenu = () => {
    inquirer.prompt([
    {
    type: "list",
    message: "Please choose an option",
    name: "action",
    choices: [
            "Add Employee",
            "Change Employee Role",
            "Add New Role",
            "Add New Department",
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
            case "Change Employee Role":
                    updateRole();
                break;
            case "Add New Role":
                    addRole();
                break;
            case "Add New Department":
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




mainMenu();