import express from "express";
import cors from "cors";

const app = express();
const PORT = 3009;
let i = 0;

// app.set('json spaces', 10);
// app.set('json replacer', (key:string,value:string)=>{
//   return value.toUpperCase()
// });

function logRequestInfo(req, res, uOrP) {
  let today = new Date();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  console.log(
    time +
      "  " +
      req.method +
      " (" +
      i +
      ") " +
      res.statusCode +
      "  " +
      req[uOrP]
  );
  i++;
}

export interface IQuote {
  id: number;
  text: string;
  author: Author;
}

export interface Author {
  age: number;
  firstName: string;
  lastName: string;
  photo: string;
  bio: string;
}

const quotes = [
  {
    id: 1,
    text: "Let me shaare myyyyy screeeeeeeeen",
    author: {
      firstName: "Nicolas",
      lastName: "Marcora",
      photo: "https://robohash.org/NicolasMarcora",
      age: 34,
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
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
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
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
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
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
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
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
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
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
// app.use(
//   cors({
//     methods: ["GET"],
//   })
// );
app.use(express.json());

app.delete("/quotes/:id", (req, res) => {
  console.log(req.params)
  const id = +req.params.id;
  const indexOfQuote = quotes.findIndex((quote) => quote.id === id);
  if (indexOfQuote !== -1) {
    quotes.splice(indexOfQuote, 1);
    res.status(200).send({ message: "Successfully deleted." });
  } else {
    res.status(404).send({ message: "Could not find quote." });
  }
  logRequestInfo(req,res,'url')
});

app.post("/quotes", (req, res) => {
  const newQuote: IQuote = req.body;
  newQuote.id = quotes[quotes.length - 1].id + 1;
  newQuote.author.age = +newQuote.author.age;

  const errors: { error: string }[] = [];

  if (
    typeof newQuote.author.age === "number" &&
    !Number.isNaN(newQuote.author.age)
  ) {
    quotes.push(newQuote);
    res.status(201).send(newQuote);
    logRequestInfo(req, res, "path");
  } else {
    errors.push({ error: "Age should be a number" });
    res.status(400).send(errors);
    logRequestInfo(req, res, "path");
  }
});

app.get("/quotes/:id", (req, res) => {
  const param = +req.params.id;
  const quoteToSend = quotes.find((quote) => quote.id === param);
  if (quoteToSend) {
    res.send(quoteToSend);
    logRequestInfo(req, res, "path");
  } else {
    res.status(404).send("<h1>Not found</h1>");
    logRequestInfo(req, res, "path");
  }
});

app.get("/quotes", (req, res) => {
  // res.json('adasdsda')
  if (Object.keys(req.query).length !== 0) {
    if (req.query.authorQ !== undefined && req.query.textQ !== undefined) {
      logRequestInfo(req, res, "url");
      res.send(
        quotes.filter(
          (quote) =>
            (
              quote.author.firstName.toLowerCase() +
              quote.author.lastName.toLowerCase()
            ).includes(req.query.authorQ as string) &&
            quote.text.toLowerCase().includes(req.query.textQ as string)
        )
      );
    } else if (req.query.authorQ !== undefined) {
      logRequestInfo(req, res, "url");
      res.send(
        quotes.filter((quote) =>
          (
            quote.author.firstName.toLowerCase() +
            quote.author.lastName.toLowerCase()
          ).includes(req.query.authorQ as string)
        )
      );
    } else if (req.query.textQ !== undefined) {
      logRequestInfo(req, res, "url");
      res.send(
        quotes.filter((quote) =>
          quote.text.toLowerCase().includes(req.query.textQ as string)
        )
      );
    }
  } else {
    logRequestInfo(req, res, "url");

    res.send(quotes);
  }
});

app.get("/random", (req, res) => {
  logRequestInfo(req, res, "path");
  res.send(quotes[Math.floor(Math.random() * quotes.length)]);
});

app.get("*", (req, res) => {
  res.status(404).send({ error: "not found" });
  logRequestInfo(req, res, "path");
});

// fs.writeFile()
