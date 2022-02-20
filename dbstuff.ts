import Database from 'better-sqlite3';

const db = new Database('./data.db', {
   verbose: console.log,
});

export const createQuotesTable = () =>
   db
      .prepare(
         `
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER,
        text TEXT,
        authorId INTEGER,
        PRIMARY KEY ("id")
        );
`
      )
      .run();

export const createAuthorsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS authors (
        id INTEGER,
        firstName TEXT,
        lastName TEXT,
        photo TEXT,
        age INTEGER,
        bio TEXT,
        PRIMARY KEY ("id")
        );
`);

createQuotesTable();
createAuthorsTable.run();

// class Car {
//     name:string
//     constructor(name) {
//       this.name = name;

//     }
//   }

//   class Tree {
//     name:[]
//     constructor(name) {
//       this.name = name;

//     }
//   }

// class Set<T extends Tree>  {
//     array: T[]
//     constructor() {
//      this.array = []
//     }

//     add(el:T) {
//         this.array.push(el)
//       }

//   }

//   class Doubler<T> {
//     text:T
//     constructor(text) {
//       this.text = text;

//     }

//     print(){
//         console.log(2 * this.text)
//         // console.log(this.text)
//     }
//   }

// let arr= new Set<Car>()
// arr.add(new Car('beetle'))
// arr.add(new Tree([]))

// let arr2= new Set<Tree>()
// arr2.add(new Tree([]))

export function updateAuthor(
   column: string,
   value: string | number,
   id: number
): void {
    db.prepare(`UPDATE authors SET ${column}=?
WHERE id=?;`).run(value,id)


}
// const dropTable = db.prepare(`DROP TABLE (?);`)whyyyyyyyyyyyyyyyyyyyyy

export const getQuote = (id: number) =>
   db.prepare(`SELECT * FROM quotes WHERE id=(?)`).get(id);

export const getQuotesBy = (column: string, pattern: string) =>
   db.prepare(`SELECT * FROM quotes WHERE ${column} LIKE ?`).all(pattern);

export const getQuotesByTextAndAuthor = (textP: string, name: string) => {
   return db
      .prepare(
         `SELECT * FROM quotes,authors 
	WHERE text LIKE ? 
	AND (firstName LIKE ?  OR lastName LIKE ?) 
	AND authorId= authors.id
;`
      )
      .all(textP,name,name);
};

export const getRandomQuote = () =>
   db.prepare(`SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1;`).get();

export const getAllQuotes = () => db.prepare(`SELECT * FROM quotes;`).all();

export function createQuote(text: string, authorId: number) {
   return db
      .prepare(
         `
        INSERT INTO quotes (text, authorId) VALUES (?,?);
`
      )
      .run(text, authorId);
}

export const deleteAllQuotes = db.prepare(`
    DELETE FROM quotes;
`);

export const deleteQuote = (id: number) =>
   db
      .prepare(
         `
    DELETE FROM quotes WHERE id=(?);
`
      )
      .run(id);

// export const updateQuoteText = db.prepare(`
// UPDATE quotes SET (?)=?
// WHERE id=?;
// `);

// updateQuoteText.run('authorId','40',4)

export const updateQuoteText = (text: string, id: number) =>
   db
      .prepare(
         `
UPDATE quotes SET text=?
WHERE id=?;
`
      )
      .run(text, id);
export const updateQuoteAuthorId = db.prepare(`
UPDATE quotes SET authorId=?
WHERE id=?;
`);

export const createAuthor = (
   firstName: string,
   lastName: string,
   photo: string,
   age: number,
   bio: string
) =>
   db
      .prepare(
         `
        INSERT INTO authors (firstName, lastName,photo,age,bio) VALUES (?,?,?,?,?);
`
      )
      .run(firstName, lastName, photo, age, bio);

export const deleteAllAuthors = db.prepare(`
    DELETE FROM authors;
`);

export const deleteAuthor = db.prepare(`
    DELETE FROM authors WHERE id=(?);
`);

export const getAllAuthors = () => db.prepare(`SELECT * FROM authors;`).all();

export const getAuthorsByXorY = (
   column: string,
   column2: string,
   pattern: string,
   pattern2: string
) =>
   db
      .prepare(
         `
   SELECT * FROM authors WHERE ${column} LIKE ? OR ${column2} LIKE ?;`
      )
      .all(pattern, pattern2);

export const getAuthor = (id: number) =>
   db.prepare(`SELECT * FROM authors WHERE id=?;`).get(id);


export const getAuthorByXandY=(column1,column2,pattern1,pattern2)=>db
      .prepare(
         `
   SELECT * FROM authors WHERE UPPER(${column1}) = UPPER(?) AND UPPER(${column2}) = UPPER(?);`
      )
      .get(pattern1, pattern2);




// createQuote('ddddd',5)
// deleteQuote.run('4')
// dropTable.run('authors')
// updateQuoteText.run('random quote',4)
// createAuthor.run('Heri','Luga',25,'geri.jpg','this is my bio')
// deleteAuthor.run(2);

// console.log(deleteQuote(6))
