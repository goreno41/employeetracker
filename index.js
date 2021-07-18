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
      rolesList.push(res[i].title);
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


//.. Update Employee role function

const updateRole = () => {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
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
        let  employeeID
        for (i=0; i < employees.length; i++){
            if (answer.employee == employees[i].Employee){
                employeeID = employees[i].id;
            }
        }
        connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, 
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
    connection.query("SELECT role.title AS name, role.salary AS salary FROM role",   function(err, res) {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the new role?",
                name: "title"
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
                  title: res.title,
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
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "name"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                mainMenu();
            }
        )
    })

}

//.. View all employees function

const viewAllEmployees = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      mainMenu()
  })

}

//.. View employess by role function

const viewByRoles = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    mainMenu()
    })

}

//.. View employees by department function

const viewByDepartments = () => {
    onnection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    mainMenu()
  })

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
                    viewByRoles();
                break;
          case "View all Employees By Deparments":
                    viewByDepartments();
                break;
    
            }
    })
}




mainMenu();