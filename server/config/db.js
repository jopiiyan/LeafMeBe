import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

const host = process.env.HOST;
const user = process.env.NAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;


export const db = mysql.createConnection({
  host: host, // or your host name from cPanel
  user: user, // your MySQL username
  password: password, // your MySQL password
  database: database, // your MySQL database name
});
