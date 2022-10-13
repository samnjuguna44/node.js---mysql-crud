// getting the client
const mysql = require("mysql2");

const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.json());

// creating connection to database
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mayson@1323",
  database: "EmployeeDB",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3006, () =>
  console.log("Express server is running at port no : 3006")
);

//Get all employees data
app.get("/employees", (req, res) => {
  mysqlConnection.query("SELECT * FROM Employee", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//Get an employee data
app.get("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM Employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an employee data
app.delete("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM Employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully");
      else console.log(err);
    }
  );
});

//Insert an employee data
app.post("/employees", (req, res) => {
  let emp = req.body;
  const sql =
    "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
            res.send("Inserted employee id : " + element[0].EmpID);
        });
      else console.log(err);
    }
  );
});

//Update an employee data
app.put("/employees", (req, res) => {
  let emp = req.body;
  const sql =
    "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err) res.send("Updated successfully");
      else console.log(err);
    }
  );
});
