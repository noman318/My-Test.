const mysql = require("mysql");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./.env" });

const app = express();
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("My SQL connected");
  }
});

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/auth", require("./routes/auth"));

app.listen(3306, () => {
  console.log("Server started 🚀");
});
