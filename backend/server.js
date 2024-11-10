import express from "express";
import pg from "pg";
import bodyParser from "body-parser"; // for Postman
import cors from "cors";
import env from "dotenv";

env.config();
const db = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

const app = express();
const port = 3000;
db.connect();
app.use(express.json()); //for React Forms
// app.use(bodyParser.urlencoded({extended: true})); // for Postman

app.use(cors());

app.get("/todoapi/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todolist ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.json(`${error}`);
  }
});

app.get("/todoapi/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { itemtext } = req.body;

  const result = await db.query("SELECT * from todolist where id=$1", [id]);
  if (result.rows[0] != null) {
    res.json(result.rows[0]);
  } else {
    res.json("Todo Item doesn't exist! The id is invalid.");
  }
});

app.post("/todoapi/createtodo", async (req, res) => {
  const { itemtext } = req.body;

  try {
    await db.query("INSERT INTO todolist(itemtext) VALUES($1)", [itemtext]);
    const result = await db.query(
      "SELECT * FROM todolist WHERE id=(SELECT MAX(id) FROM todolist)"
    );

    res.json({
      message: "Todo Item add succesfully!",
      addedItem: result.rows[0],
    });
  } catch (error) {
    res.json(`${error}`);
  }
});

app.put("/todoapi/replacetodo/:id", async (req, res) => {
  const { id } = req.params;
  const { itemtext } = req.body;

  const result = await db.query("SELECT * FROM todolist WHERE id=$1", [id]);

  if (result.rows[0] != null) {
    try {
      if (!itemtext) {
        res.json("Title is missing");
      } else {
        await db.query("UPDATE todolist SET itemtext=$1 WHERE id=$2", [
          itemtext,
          id,
        ]);
        const updatedResult = await db.query(
          "SELECT * FROM todolist WHERE id=$1",
          [id]
        );
        res.json({
          message: "Todo Item updated succesfully",
          updatedItem: updatedResult.rows[0],
        });
      }
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.patch("/todoapi/edittodo/:id", async (req, res) => {
  const { id } = req.params;
  const { itemtext } = req.body;

  const result = await db.query("SELECT * FROM todolist WHERE id=$1", [id]);
  if (result.rows[0] != null) {
    try {
      if (itemtext) {
        await db.query("UPDATE todolist SET itemtext=$1 WHERE id=$2", [
          itemtext,
          id,
        ]);
        const updatedItem = await db.query("SELECT * from todolist where id=$1", [
          id,
        ]);
        res.json({
            message: "Todo Item updated succesfully",
            updatedItm: updatedItem.rows[0],
          });
        
      } else {
        res.json({
          message: "Todo Item hasn't changed, no data to modify",
          item: result.rows[0],
        });
      }
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.delete("/todoapi/deletetodo/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query("SELECT from todolist where id=$1", [id]);
  if (result.rows[0] != null) {
    try {
      await db.query("DELETE FROM todolist WHERE id=$1", [id]);
      res.json("Todo Item deleted succesfully");
    } catch (error) {
      res.json(`${error}`);
    }
  } else {
    res.json("The id is invalid.");
  }
});

app.delete("/todoapi/deleteall", async (req, res) => {
  try {
    await db.query("DELETE FROM todolist");
    res.json("All Items deleted sucessfully");
  } catch (error) {
    res.json(`${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
