const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});
exports.register = (req, res) => {
  console.log(req.body);

  const name = req.body.name;

  const email = req.body.email;

  const password = req.body.password;

  const confirmpassword = req.body.confirmpassword;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          MessageChannel: "The Email is already in Use",
        });
      } else if (password !== confirmpassword) {
        return res.render("register", {
          MessageChannel: "Passwords do not match",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          email: email,
          password: hashedPassword,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.render("register", {
              MessageChannel: "User Registered",
            });
          }
        }
      );
    }
  );
};
exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  var sql = "select * from users where email = ?;";

  db.query(sql, [email], function (err, result, fields) {
    if (err) throw err;
    if (result.length && bcrypt.compareSync(password, result[0].password)) {
    } else {
      res.redirect("/");
    }
  });
  console.log(req.body);
};
