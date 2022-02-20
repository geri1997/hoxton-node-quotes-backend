import express, { json } from 'express';
import cors from 'cors';
import {
   createAuthor,
   createQuote,
   createQuotesTable,
   deleteQuote,
   getAllAuthors,
   getAllQuotes,
   getAuthor,
   getAuthorByName,
   getAuthorsBy,
   getQuote,
   getQuotesByTextAndAuthor,
   getRandomQuote,
   getSearchedQuotes,
   updateAuthor,
   updateQuoteText,
} from './dbstuff';

const app = express();
const PORT = 3009;
let i = 0;

// app.set('json spaces', 10);
// app.set('json replacer', (key:string,value:string)=>{
//   return value.toUpperCase()
// });

function logRequestInfo(req, res, uOrP: string): void {
   let today = new Date();
   let hours =
      today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
   let minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
   let seconds =
      today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
   let time = hours + ':' + minutes + ':' + seconds;

   console.log(
      time +
         '  ' +
         req.method +
         ' (' +
         i +
         ') ' +
         res.statusCode +
         '  ' +
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

const objectToTestKeysAgainst = {
   text: 'string',
   age: 'number',
   firstName: 'string',
   lastName: 'string',
   photo: 'string',
   bio: 'string',
};

const db: { quotes: IQuote[]; author: IAuthor[] } = {
   quotes: [
      {
         id: 1,
         text: 'Let me shaare myyyyy screeeeeeeeen',
         authorId: 1,
      },
      {
         id: 2,
         text: 'I will bite',
         authorId: 2,
      },
      {
         id: 3,
         text: 'I have a question',
         authorId: 3,
      },
      {
         id: 4,
         text: '-',
         authorId: 4,
      },
      {
         id: 5,
         text: 'If you do a HEAD request, will the server give you head 🤔',
         authorId: 5,
      },
   ],
   author: [
      {
         firstName: 'Everyone when Nico',
         lastName: 'asks a question',
         age: 0,
         photo: 'https://robohash.org/Hoxton',
         bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?',
         id: 4,
      },
      {
         firstName: 'Geri',
         lastName: 'Luga',
         age: 24,
         photo: 'https://robohash.org/GeriLuga',
         bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?',
         id: 3,
      },
      {
         firstName: 'Ed',
         lastName: 'Putans',
         photo: 'https://robohash.org/EdPutans',
         age: 28,
         bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?',
         id: 2,
      },
      {
         firstName: 'Nicolas',
         lastName: 'Marcora',
         photo: 'https://robohash.org/NicolasMarcora',
         age: 34,
         bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?',
         id: 1,
      },
      {
         firstName: 'Not',
         lastName: 'Geri',
         age: 24,
         photo: 'https://robohash.org/NotGeri',
         bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos laboriosam at ut expedita non, itaque nobis magnam, dolores ipsam vitae, totam laudantium iure unde soluta? Quos accusantium officiis qui amet?',
         id: 5,
      },
   ],
};

// updateAuthor('age', 15, 1)

app.listen(PORT, () => {
   return console.log(`Server.ts started on port ${PORT}`);
});
app.use(
   cors({
      origin: '*',
   })
);
// app.use(
//   cors({
//     methods: ["GET"],
//   })
// );
app.use(express.json());

app.patch('/quotes/:id', (req, res) => {
   const id = +req.params.id;
   const quoteMatch = getQuote(id);
   //  const author: IAuthor = req.body.author;
   const errors = [];

   if (!quoteMatch)
      res.status(404).send({
         error: `A quote with the id ${req.params.id} doesn't exist.`,
      });

   if (typeof req.body?.text === 'string') {
      if (quoteMatch) quoteMatch.text = req.body.text;
      res.send(quoteMatch);
      updateQuoteText(req.body.text, id);
      logRequestInfo(req, res, 'url');
      return;
   }
   res.status(400).send({ error: 'The value should be a string.' });
   logRequestInfo(req, res, 'url');
   return;
});

app.patch('/author/:id', (req, res) => {
   const id = Number(req.params.id);
   const authorMatch = getAuthor(id);

   if (authorMatch) {
      if (
         req.body.age &&
         (typeof Number(req.body.age) !== 'number' ||
            Number.isNaN(Number(req.body.age)) ||
            typeof req.body.age === 'boolean' ||
            typeof req.body.age === 'object')
      ) {
         res.status(400).send({ message: 'Age should be a number' });
         logRequestInfo(req, res, 'url');
         return;
      } else {
         for (const property in req.body) {
            if (authorMatch[property] !== undefined && property !== 'id') {
               if (property === 'age') {
                  authorMatch[property] = Number(req.body[property]);
                  updateAuthor(property, Number(req.body[property]), id);
               } else if (typeof req.body[property] === 'string') {
                  authorMatch[property] = req.body[property];
                  updateAuthor(property, req.body[property], id);
               } else {
                  res.send({ error: `${property} should be a string` });
                  logRequestInfo(req, res, 'url');
                  return;
               }
            }
         }
         res.send(authorMatch);
         logRequestInfo(req, res, 'url');
         return;
      }
   } else {
      res.status(404).send({ error: 'Author not found.' });
   }
});

app.delete('/quotes/:id', (req, res) => {
   const id = +req.params.id;

   // const indexOfQuote = db.quotes.findIndex((quote) => quote.id === id);
   if (deleteQuote(id).changes) {
      res.status(200).send({ message: 'Successfully deleted.' });
   } else {
      res.status(404).send({ message: 'Could not find quote.' });
   }
   logRequestInfo(req, res, 'url');
});

app.post('/quotes', (req, res) => {
   const errors: { error: string }[] = [];
   const author: IAuthor = req.body.author;
   // const lastQuoteId = Math.max(...db.quotes.map((quote) => quote.id));
   // const lastAuthorId = Math.max(...db.author.map((author) => author.id));

   if (
      !author ||
      typeof req.body?.text !== 'string' ||
      typeof author?.firstName !== 'string' ||
      typeof author?.lastName !== 'string' ||
      typeof author?.bio !== 'string' ||
      typeof author?.photo !== 'string' ||
      typeof author?.bio !== 'string' ||
      !(
         typeof Number(req.body.author.age) === 'number' &&
         !Number.isNaN(Number(req.body.author.age)) &&
         typeof req.body.author.age !== 'boolean' &&
         typeof req.body.author.age !== 'object'
      ) ||
      Object.keys(req.body).length > 2 ||
      Object.keys(req.body.author).length > 5
   ) {
      errors.push({
         error: 'Missing properties, wrong type or extra properties.',
      });
      res.status(400).send(errors);
      logRequestInfo(req, res, 'path');
      return;
   }

   const newQuote: IQuote = { text: req.body.text, authorId: 0, id: 0 };

   const authorMatch = getAuthorByName(author.firstName, author.lastName);

   author.age = Number(author.age);
   if (authorMatch) {
      const result = createQuote(newQuote.text, authorMatch.id);

      res.status(201).send({
         text: newQuote.text,
         authorId: authorMatch.id,
         id: result.lastInsertRowid,
         author:{...authorMatch}
      });

      logRequestInfo(req, res, 'url');
   } else {
      const authorResult = createAuthor(
         author.firstName,
         author.lastName,
         author.photo,
         author.age,
         author.bio
      );

      const quoteResult = createQuote(newQuote.text, authorResult.lastInsertRowid as number);

      res.status(201).send({
         text: newQuote.text,
         authorId: authorResult.lastInsertRowid,
         id: quoteResult.lastInsertRowid,
         author: { ...author, id: authorResult.lastInsertRowid },
      });

      logRequestInfo(req, res, 'url');
   }
});

app.get('/quotes/:id', (req, res) => {
   const param = +req.params.id;
   const quoteFound = db.quotes.find((quote) => quote.id === param);
   if (!quoteFound) {
      res.status(404).send('<h1>Not found</h1>');
      logRequestInfo(req, res, 'path');
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
      logRequestInfo(req, res, 'path');
   }
});

app.get('/quotes', (req, res) => {
   // const quotes = getAllQuotes();
   // // const authors = getAllAuthors() SHould i do this and use .find(), or line 344
   // //at search queries, should i get from db or filter here. which one is faster

   // for (const quote of quotes) {
   //    const authorMatch = getAuthor(quote.authorId);
   //    quote.author = authorMatch;
   // }

   if (req.query.authorQ !== undefined && req.query.textQ !== undefined) {
      logRequestInfo(req, res, 'url');

      res.send(
         getQuotesByTextAndAuthor(
            `%${req.query.textQ}%`,
            `%${req.query.authorQ}%`
         )
      );
      // res.send(
      //    quotes.filter(
      //       (quote) =>
      //          (
      //             quote.author.firstName.toLowerCase() +
      //             quote.author.lastName.toLowerCase()
      //          ).includes(req.query.authorQ as string) &&
      //          quote.text.toLowerCase().includes(req.query.textQ as string)
      //    )
      // );
   } else if (req.query.authorQ !== undefined) {
      logRequestInfo(req, res, 'url');
      const searchedAuthors = getAuthorsBy(
         'lastName',
         'firstName',
         `%${req.query.authorQ}%`,
         `%${req.query.authorQ}%`
      );
      // const quotesToSend= getSearchedQuotes(`firstName OR lastName`,`%${req.query.authorQ}%`)
      const quotesToSend: {}[] = [];
      for (const author of searchedAuthors) {
         const authorQuotes = getSearchedQuotes('authorId', `${author.id}`);
         for (const quote of authorQuotes) {
            quote.author = author;
            quotesToSend.push(quote);
         }
      }
      // const quotesToSend = getSearchedQuotes(`authorId`,`${searchedAuthor.id}`)
      res.send(quotesToSend);

      // res.send(
      //    quotes.filter((quote) =>
      //       (
      //          quote.author.firstName.toLowerCase() +
      //          quote.author.lastName.toLowerCase()
      //       ).includes(req.query.authorQ as string)
      //    )
      // );
   } else if (req.query.textQ !== undefined) {
      logRequestInfo(req, res, 'url');
      const quotesToSend = getSearchedQuotes(
         'text',
         '%' + req.query.textQ + '%'
      );
      for (let quote of quotesToSend) {
         quote.author = getAuthor(quote.authorId);
      }
      res.send(quotesToSend);
      // res.send(
      //    quotes.filter((quote) =>
      //       quote.text.toLowerCase().includes(req.query.textQ as string)
      //    )
      // );
   } else {
      logRequestInfo(req, res, 'url');
      const quotes = getAllQuotes();
      for (const quote of quotes) {
         const authorMatch = getAuthor(quote.authorId);
         quote.author = authorMatch;
      }

      res.send(quotes);
   }
});

app.get('/random', (req, res) => {
   const randomQuote = getRandomQuote();
   const authorOfQuoteToSend = getAuthor(randomQuote.authorId);

   const quoteToSend: IQuoteWithAuthor = {
      ...randomQuote,
      author: authorOfQuoteToSend,
   };
   logRequestInfo(req, res, 'path');
   res.send(quoteToSend);
});

app.get('*', (req, res) => {
   res.status(404).send({ error: 'not found' });
   logRequestInfo(req, res, 'path');
});

// fs.writeFile()
