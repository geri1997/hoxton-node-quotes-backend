import express from "express";
import cors from "cors";
import fs from "fs";
let stringify = require("json-stringify-safe");

const app = express();
const PORT = 3009;

const quotes = [
  {
    id: 1,
    text: "Let me shaare myyyyy screeeeeeeeen",
    author: "Nicolas Marcora",
  },
  { id: 2, text: "I will bite", author: "Ed Putans" },
  { id: 3, text: "I have a question", author: "Geri Luga" },
  { id: 4, text: "-", author: "Everyone when Nico asks a question" },
];

app.listen(PORT);
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  cors({
    methods: ["GET"],
  })
);
app.get("/quotes", (req, res) => {
  const reqString = stringify(req);
  fs.writeFile("log.txt", reqString, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  res.send(quotes);
});
app.get("*", (req, res) => {
  res.status(404).send({ error: "not found" });
});

// fs.writeFile()
