import express from "express";
import cors from "cors";

const app = express();
const PORT = 3009;
let i = 0;

// app.set('json spaces', 10);
// app.set('json replacer', (key:string,value:string)=>{
//   return value.toUpperCase()
// });

const quotes = [
  {
    id: 1,
    text: "Let me shaare myyyyy screeeeeeeeen",
    author: {
      firstName: "Nicolas",
      lastName: "Marcora",
      photo: "https://robohash.org/NicolasMarcora",
      age: 34,
    },
  },
  {
    id: 2,
    text: "I will bite",
    author: {
      firstName: "Ed",
      lastName: "Putans",
      photo: "https://robohash.org/EdPutans",
      age: 28,
    },
  },
  {
    id: 3,
    text: "I have a question",
    author: {
      firstName: "Geri",
      lastName: "Luga",
      age: 24,
      photo: "https://robohash.org/GeriLuga",
    },
  },
  {
    id: 4,
    text: "-",
    author: {
      firstName: "Everyone when Nico",
      lastName: "asks a question",
      age: 0,
      photo: "https://robohash.org/Hoxton",
    },
  },
  {
    id: 5,
    text: "If you do a HEAD request, will the server give you head 🤔",
    author: {
      firstName: "Not",
      lastName: "Geri",
      age: 24,
      photo: "https://robohash.org/NotGeri",
    },
  },
];

app.listen(PORT, () => {
  return console.log(`Server.ts started on port ${PORT}`);
});
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
app.use(express.json())

app.post('/quotes',(req,res)=>{
  const newQuote=req.body
  newQuote.id=quotes[quotes.length-1].id +1
  quotes.push(newQuote)
  res.status(201).send(newQuote)
})

app.get("/quotes", (req, res) => {
  // res.json('adasdsda')
  if (Object.keys(req.query).length !== 0) {
    if (req.query.authorQ !== undefined && req.query.textQ !== undefined) {
      console.log(
        req.method + " (" + i + ") " + res.statusCode + "  " + req.url
      );
      i++;
      res.send(
        quotes.filter(
          (quote) =>
            (
              quote.author.firstName.toLowerCase() + quote.author.lastName.toLowerCase()
            ).includes(req.query.authorQ as string) &&
            quote.text.toLowerCase().includes(req.query.textQ as string)
        )
      );
    } else if (req.query.authorQ !== undefined) {
      console.log(
        req.method + " (" + i + ") " + res.statusCode + "  " + req.url
      );
      i++;
      res.send(
        quotes.filter((quote) =>
          (
            quote.author.firstName.toLowerCase() + quote.author.lastName.toLowerCase()
          ).includes(req.query.authorQ as string)
        )
      );
    } else if (req.query.textQ !== undefined) {
      console.log(
        req.method + " (" + i + ") " + res.statusCode + "  " + req.url
      );
      i++;
      res.send(
        quotes.filter((quote) =>
          quote.text.toLowerCase().includes(req.query.textQ as string)
        )
      );
    }
  } else {
    console.log(
      req.method + " (" + i + ") " + res.statusCode + "  " + req.path
    );
    i++;
    res.send(quotes);
  }
});

app.get("/random", (req, res) => {
  console.log(req.method + " (" + i + ") " + res.statusCode + "  " + req.path);
  i++;
  res.send(quotes[Math.floor(Math.random() * quotes.length)]);
});

app.get("*", (req, res) => {
  res.status(404).send({ error: "not found" });
  console.log(req.method + " (" + i + ") " + res.statusCode + "  " + req.path);
  i++;
});

// fs.writeFile()
