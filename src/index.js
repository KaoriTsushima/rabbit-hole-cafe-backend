import express from "express";
import dotenv from "dotenv";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
