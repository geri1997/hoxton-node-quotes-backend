import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = 3009;
let i = 0;

// app.set('json spaces', 10);
// app.set('json replacer', (key:string,value:string)=>{
//   return value.toUpperCase()
// });

// function doesAuthorExist(firstName:string,lastName:string):Boolean{
//   for (const author of db.author) {
//     if(author.firstName.toLowerCase()===firstName&&author.lastName===lastName){
//       return true
//     }
//   }
//   return false
// }

function logRequestInfo(req, res, uOrP: string): void {
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
   authorId: number;
}

export interface IAuthor {
   age: number;
   firstName: string;
   lastName: string;
   photo: string;
   bio: string;
   id: number;
}

export interface IQuoteWithAuthor {
   id: number;
   text: string;
   authorId: number;
   author: IAuthor;
}

const db: { quotes: IQuote[]; author: IAuthor[] } = {
   quotes: [
      {
         id: 1,
         text: "Let me shaare myyyyy screeeeeeeeen",
         authorId: 1,
      },
      {
         id: 2,
         text: "I will bite",
         authorId: 2,
      },
      {
         id: 3,
         text: "I have a question",
         authorId: 3,
      },
      {
         id: 4,
         text: "-",
         authorId: 4,
      },
      {
         id: 5,
         text: "If you do a HEAD request, will the server give you head 🤔",
         authorId: 5,
      },
   ],
   author: [
      {
         firstName: "Everyone when Nico",
         lastName: "asks a question",
         age: 0,
         photo: "https://robohash.org/Hoxton",
         bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
         id: 4,
      },
      {
         firstName: "Geri",
         lastName: "Luga",
         age: 24,
         photo: "https://robohash.org/GeriLuga",
         bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
         id: 3,
      },
      {
         firstName: "Ed",
         lastName: "Putans",
         photo: "https://robohash.org/EdPutans",
         age: 28,
         bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
         id: 2,
      },
      {
         firstName: "Nicolas",
         lastName: "Marcora",
         photo: "https://robohash.org/NicolasMarcora",
         age: 34,
         bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
         id: 1,
      },
      {
         firstName: "Not",
         lastName: "Geri",
         age: 24,
         photo: "https://robohash.org/NotGeri",
         bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?",
         id: 5,
      },
   ],
};

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

app.patch("/quotes/:id", (req, res) => {
   const id = +req.params.id;
   const quoteMatch = db.quotes.find((quote) => quote.id === id);
   if (req.body.text) {
      if (quoteMatch) quoteMatch.text = req.body.text;
      res.send(quoteMatch);
      logRequestInfo(req, res, "url");
   } else {
      if (quoteMatch) {
         const authorMatch = db.author.find(
            (author) => author.id === quoteMatch.authorId
         );
         if (authorMatch) {
            if (req.body.age) {
               if (
                  typeof Number(req.body.age) === "number" &&
                  !Number.isNaN(Number(req.body.age)) &&
                  typeof req.body.age !== "boolean" &&
                  typeof req.body.age !== "object"
               ) {
                  authorMatch.age = req.body.age;
                  res.send(authorMatch);
                  logRequestInfo(req, res, "url");
               } else {
                  res.status(400).send({ message: "Age should be a number" });
                  logRequestInfo(req, res, "url");
               }
            } else {
               for (const property in req.body) {
                  authorMatch[property] = req.body[property];
                  res.send(authorMatch);
                  logRequestInfo(req, res, "url");
               }
            }
         }
      }
   }
});

app.delete("/quotes/:id", (req, res) => {
   const id = +req.params.id;
   const indexOfQuote = db.quotes.findIndex((quote) => quote.id === id);
   if (indexOfQuote !== -1) {
      db.quotes.splice(indexOfQuote, 1);
      res.status(200).send({ message: "Successfully deleted." });
   } else {
      res.status(404).send({ message: "Could not find quote." });
   }
   logRequestInfo(req, res, "url");
});

app.post("/quotes", (req, res) => {
   const errors: { error: string }[] = [];
   const newQuote: IQuote = { text: req.body.text, authorId: 0, id: 0 };
   const author: IAuthor = req.body.author;

   newQuote.id = db.quotes[db.quotes.length - 1].id + 1;

   const authorMatch = db.author.find(
      (autho) =>
         autho.firstName.toLowerCase().trim() ===
            author.firstName.toLowerCase().trim() &&
         autho.lastName.toLowerCase().trim() ===
            author.lastName.toLowerCase().trim()
   );

   if (
      typeof Number(req.body.author.age) === "number" &&
      !Number.isNaN(Number(req.body.author.age)) &&
      typeof req.body.author.age !== "boolean" &&
      typeof req.body.author.age !== "object"
   ) {
      author.age = Number(author.age);
      if (authorMatch) {
         newQuote.authorId = authorMatch.id;
         db.quotes.push(newQuote);
         const quoteToSend: IQuoteWithAuthor = {
            ...newQuote,
            author: authorMatch,
         };

         res.status(201).send(quoteToSend);

         logRequestInfo(req, res, "url");
      } else {
         author.id = db.author[db.author.length - 1].id + 1;
         db.author.push(author);
         newQuote.authorId = author.id;
         db.quotes.push(newQuote);
         const quoteToSend: IQuoteWithAuthor = {
            ...newQuote,
            author: author,
         };

         res.status(201).send(quoteToSend);

         logRequestInfo(req, res, "url");
      }
   } else {
      errors.push({ error: "Age should be a number" });
      res.status(400).send(errors);
      logRequestInfo(req, res, "path");
   }
});

app.get("/quotes/:id", (req, res) => {
   const param = +req.params.id;
   const quoteFound = db.quotes.find((quote) => quote.id === param);
   if (!quoteFound) {
      res.status(404).send("<h1>Not found</h1>");
      logRequestInfo(req, res, "path");
      return;
   }

   const authorOfQuote = db.author.find(
      (auth) => auth.id === quoteFound.authorId
   );
   if (!authorOfQuote) return;

   if (quoteFound) {
      const quoteToSend: IQuoteWithAuthor = {
         ...quoteFound,
         author: authorOfQuote,
      };

      res.send(quoteToSend);
      logRequestInfo(req, res, "path");
   }
});

app.get("/quotes", (req, res) => {
   const quotesCopy = JSON.parse(JSON.stringify(db.quotes));

   for (const quote of quotesCopy) {
      const authorMatch = db.author.find(
         (author) => author.id === quote.authorId
      );
      quote.author = authorMatch;
   }

   if (req.query.authorQ !== undefined && req.query.textQ !== undefined) {
      logRequestInfo(req, res, "url");
      res.send(
         quotesCopy.filter(
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
         quotesCopy.filter((quote) =>
            (
               quote.author.firstName.toLowerCase() +
               quote.author.lastName.toLowerCase()
            ).includes(req.query.authorQ as string)
         )
      );
   } else if (req.query.textQ !== undefined) {
      logRequestInfo(req, res, "url");
      res.send(
         quotesCopy.filter((quote) =>
            quote.text.toLowerCase().includes(req.query.textQ as string)
         )
      );
   } else {
      logRequestInfo(req, res, "url");

      res.send(quotesCopy);
   }
});

app.get("/random", (req, res) => {
   const randomQuote = db.quotes[Math.floor(Math.random() * db.quotes.length)];
   const authorOfQuoteToSend = db.author.find(
      (author) => author.id === randomQuote.authorId
   )!;
   const quoteToSend: IQuoteWithAuthor = {
      ...randomQuote,
      author: authorOfQuoteToSend,
   };
   logRequestInfo(req, res, "path");
   res.send(quoteToSend);
});

app.get("*", (req, res) => {
   res.status(404).send({ error: "not found" });
   logRequestInfo(req, res, "path");
});

// fs.writeFile()
