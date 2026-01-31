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

router.get("/device-state", (req, res) => {
  const sql = "SELECT * from device_state WHERE id=1";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result[0]);
  });
});


router.get("/device-state/status", (req, res) => {
  const sql = "SELECT status from device_state WHERE id=1";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result[0]);
  });
});



router.put("/device-state/daily", (req, res) => {
  const sql = "UPDATE device_state SET daily_watering = ? WHERE id = 1;";
  const value = req.body.daily_watering;
  db.query(sql, [value], (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.json(result);
  });
});

//app update device_state
router.put("/device-state/start", (req, res) => {
  const target_ml = req.body.water;

  if (target_ml == null) {
    return res.status(400).json({ message: "target_ml is required" });
  }

  const sql = `
    UPDATE device_state
    SET target_ml = ?, cycles_done = 0, status = 1
    WHERE id = 1;
  `;

  db.query(sql, [target_ml], (err, result) => {
    if (err) return res.json(err);
    res.json({ message: "Job started", result });
  });
});

//app retreive water dispensed today
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

//app update the ml
router.put("/device-state/target", (req, res) => {
  const { target_ml } = req.body;

  if (!target_ml || isNaN(target_ml)) {
    return res.status(400).json({ error: "Invalid target_ml value" });
  }

  const sql = "UPDATE device_state SET target_ml = ? WHERE id = 1";

  db.query(sql, [target_ml], (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.json(result);
  });
});

//app retreive weekly data
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

//esp32 updates data
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

router.get("/device-state/status", (req, res) => {
  const sql = "SELECT ";
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

//esp32 updates state and cycles
router.put("/device-state/update-esp", (req, res) => {
  const { cycles_done, status } = req.body;

  // must send at least ONE field
  if (cycles_done == null && status == null) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const sql = `
    UPDATE device_state
    SET 
      cycles_done = COALESCE(?, cycles_done),
      status = COALESCE(?, status)
    WHERE id = 1;
  `;

  db.query(sql, [cycles_done, status], (err, result) => {
    if (err) return res.json(err);
    res.json({ message: "ESP32 updated device_state", result });
  });
});
