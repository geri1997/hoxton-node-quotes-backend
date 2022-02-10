import express from "express";
import cors from "cors";

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
  { id: 4, text: "test test test test", author: "geriiiiii lugaaaa" },
  { id: 5, text: "test test test test", author: "geriiiiii lugaaaa" },
  { id: 6, text: "test test test test", author: "geriiiiii lugaaaa" },
  { id: 7, text: "test test test test", author: "geriiiiii lugaaaa" },
  { id: 8, text: "test test test test", author: "geriiiiii lugaaaa" },
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
  res.send(quotes);
});
