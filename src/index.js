const express = require("express");
// import express from "express";

const app = express();
const port = 8000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
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
