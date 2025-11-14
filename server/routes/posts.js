import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

export default router;

router.get("/", (req, res) => {
  const sql = "SELECT * from WaterIn";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result);
    console.log("Connection is succesful");
  });
});

router.post("/insert", (req, res) => {
  const sql = "INSERT INTO WaterIn(Water) VALUES(?)";
  const water = req.body.water;
  db.query(sql, [water], (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json({ message: "Updated Succesfully", result });
  });
});

router.get("/sum", (req, res) => {
  const sql =
    "SELECT SUM(Water) as Sum FROM WaterIn WHERE DATE(created_at) = CURDATE();";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result[0]);
  });
});

router.get("/latest", (req, res) => {
  const sql = "SELECT Water FROM WaterIn ORDER BY id DESC LIMIT 1 ";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json(result[0]);
  });
});
