import express from "express";
import dotenv from "dotenv";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcrypt";

dotenv.config();
const dbClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const app = express();
const port = 8000;

app.use(express.json());
app.get("/", async (req, res) => {
  const command = new ListTablesCommand({});
  const response = await dbClient.send(command);
  res.send(response);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  if (req.body.password !== "sakura") {
    return res.sendStatus(403);
  }
  res.send("Login successful!");
});

app.post("/user", async (req, res) => {
  console.log(req.body);

  const hash = await bcrypt.hash(req.body.password, 10); //instead of calling back function
  console.log(hash);
  res.status(201).send();
});

app.post("/user/login", async (req, res) => {
  const hash = "$2b$10$d2SodQUlWjwT0dZLgkvDI.SYixCDxz70NESR7FbgtzXi92LhL5YNO";

  const match = await bcrypt.compare(req.body.password, hash);

  if (match) {
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
