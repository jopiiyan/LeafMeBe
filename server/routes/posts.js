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

router.get("/weekly", (req, res) => {
  const sql = `
 SELECT
  SUBSTRING(created_at, 1, 10) AS day,
  SUM(Water) AS total_water
FROM WaterIn
WHERE YEARWEEK(SUBSTRING(created_at, 1, 10), 2) =
      YEARWEEK(CURDATE(), 2) + ?
GROUP BY day
ORDER BY day;

`;

  const offset = Number(req.query.offset || 0);

  db.query(sql, [offset], (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result);
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
