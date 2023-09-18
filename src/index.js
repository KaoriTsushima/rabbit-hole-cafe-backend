import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcrypt";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { generateJWT } from "./utils/jwt.js";
import { auth } from "./middleware/auth.js";

dotenv.config();
const dbClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dbClient);
const cookieOptions = { maxAge: 60 * 60 * 1000, httpOnly: true, path: "/" };

const TOKEN_COOKIE_NAME = "token";
const LOGIN_ERROR_MESSAGE = "Something wrong. Try again";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cookieParser())
app.get("/", async (req, res) => {
  const command = new ListTablesCommand({});
  const response = await dbClient.send(command);
  res.send(response);
});

// app.post("/login", (req, res) => {
//   console.log(req.body);
//   if (req.body.password !== "sakura") {
//     return res.sendStatus(403);
//   }
//   res.send("Login successful!");
// });

app.post("/user", async (req, res) => {
  const checkExistingEmail = new GetCommand({
    TableName: "RHC-USERS",
    Key: {
      email: req.body.email,
    },
  });
  const response = await docClient.send(checkExistingEmail);

  if (response.Item) {
    return res.status(409).send("Email already exists.");
  }

  const hash = await bcrypt.hash(req.body.password, 10); //instead of calling back function
  console.log(hash);

  const createNewAccount = new PutCommand({
    TableName: "RHC-USERS",
    Item: {
      email: req.body.email,
      passwordHash: hash,
      favourites: [],
    },
  });

  await docClient.send(createNewAccount);
  res.status(201).send();
});

app.post("/user/login", async (req, res) => {
  const getUserByEmail = new GetCommand({
    TableName: "RHC-USERS",
    Key: {
      email: req.body.email,
    },
  });
  const response = await docClient.send(getUserByEmail);
  const user = response.Item;
  if (!user) {
    return res.status(400).send(LOGIN_ERROR_MESSAGE);
  }

  const match = await bcrypt.compare(req.body.password, user.passwordHash);
  if (match) {
    delete user.passwordHash;
    const jwt = generateJWT(req.body.email);
  
    res.cookie(TOKEN_COOKIE_NAME, jwt, cookieOptions);
    res.status(200).send(user);
  } else {
    res.status(400).send(LOGIN_ERROR_MESSAGE);
  }
});

app.get("/test/auth", auth, async(req, res) => {
  return res.status(200).send(res.decodedJwt)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
