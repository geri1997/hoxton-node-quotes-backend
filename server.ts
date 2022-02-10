import express from "express";
import cors from "cors";
import fs from "fs";

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
  // fs.writeFile("logi.txt", JSON.stringify(req, undefined, 2), (err) => {
  //   if (err) throw err;
  //   console.log("The file has been saved!");
  // });
  res.send(quotes);
});

// fs.writeFile()
