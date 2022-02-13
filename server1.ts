import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
let stringify = require("json-stringify-safe");
import cheerio from "cheerio";
import { AxiosResponse } from "axios";
const axios = require("axios").default;

const app = express();
const PORT = process.env.PORT || 3009;// ky kodi shtese asht per heroku

//static web server
//kto bajn qe mundesh me hi direkt te cdo file brenda ityne folders. vne emrin e files si slug edhe dalin
//per me access kto files brenda ktyne fodlers duhet me shkru emrin e files exactly si asht bashke me extension(pervec root qe nqs e len root, bahet display index.html). keka mir qe kto static qe jan per cdo file brenda nji folderit, me i perfdr per folders qe kan images,css etj kurse folders me html files asht ma mir me i vu me at mnyren poshte, me routes.
// app.use(express.static(path.join(__dirname, "html")));

// app.use(express.static(path.join(__dirname, "styles")));

// app.use(express.static(path.join(__dirname, "js")));

// app.use(express.static(path.join(__dirname, "pulbic")));

//Routes
//ky kod asht per nji file teke. mundesh me ja vu slug si tdush vec. mundet mas me pas kidhje hic me filename. keka mir qe kto routes qe jan per file teke me i perfor per html files kurse css files,images,etj asht ma mir me i vu me at mnyren siper, me static web server

// app.get("/cat", (req, res) => {
//     console.log(req.method +'  '+ res.statusCode + '  ' + req.path)
//   res.sendFile(path.join(__dirname, "pulbic/any.jpg"));
// });

// app.get("/balls", (req, res) => {
//   res.sendFile(path.join(__dirname, "pulbic/ts1.jpeg"));
// });

// app.get("/astronaut.sdfsdfsdf", (req, res) => {
//   res.sendFile(path.join(__dirname, "pulbic/ts2.png"));
// });

// app.get("/home", (req, res) => {
//   //nqs ve kshu status 404, bahet krejt response prej serverit 404. edhe nqs qyr te network, response status asht 404. mundem ndoshta me perdor kyt kur du me i nis googlebot 301 ose 410 ose 404. vecse duhet me ndryshu edhe content. ishtu si e kam response asht 404 not found por del faqja index.html. kjo qe shtova njat .status(404) ishte vtm test se si fillim ishte pa status
//   res.status(404).sendFile(path.join(__dirname, "html/index.html"));
// });

//Fetching and scraping with axios and cheerio
//ban get request te njaj url

app.get("/headlines", (req, res) => {
  const headlines: object[] = [];
  axios
    .get("https://www.theguardian.com/environment/climate-crisis")
    .then((resp) => {
      const html = resp.data;//res.data asht krejt html e njasaj url
      const $ = cheerio.load(html);

      //kjo pjesa me $ edhe selecters asht jquery. qyr se mund tket ma teper interesting selectors.
      $('a:contains("climate")', html).each(function () {
        // ktu duhet patjeter me declare function me function() e jo me arrow function. The behavior you have reported is not directly related to Cheerio. Instead, it concerns the JavaScript language itself. Unlike "traditional" functions such as those defined with the function keyword, so-called "arrow functions" have a this value which is lexically-scoped. You can learn more about arrow functions at this page on the Mozilla Developer Network. me arrow function nuk ban e del empty sting kur perdor .text()
  
        const title = $(this).text();
        const url=$(this).attr('href')
        headlines.push({title,url});
        //kjo siper asht isoj si  me shkru headlines.push({title:title,url:url});
      });
      res.send(headlines);
    }).catch(err=>console.log(err)) 
});
//File system stuff

// fs.readFile('./read-file-test.txt','utf-8',(err,data)=>{
//     console.log(err)
//     if(err) throw err
//     console.log(data)
//     //the file type of the written file could be .html, js css or anything else
//     fs.writeFile('./written-with-node.txt',`This is where you write ${1<2&&'(testing stuff)'} the content of the file: ${data}`, (err)=>{
//         if(err) throw err
//         console.log('file created')
//     })
// })

//port
app.listen(PORT, () => {
  return console.log(`Server.ts started on port ${PORT}`);
});
// app.use(
//   cors({
//     origin: "*",
//   })
// );
// app.use(
//   cors({
//     methods: ["GET"],
//   })
// );
// app.get("/quotes", (req, res) => {
//   const reqString = stringify(req);
//   fs.writeFile("log.txt", reqString, (err) => {
//     if (err) throw err;
//     console.log("The file has been saved!");
//   });
//   res.send(quotes);
// });

// app.get("/random", (req, res) => {

//   res.send(quotes[Math.floor(Math.random()*quotes.length)]);
// });

// app.get("*", (req, res) => {
//   res.status(404).send({ error: "not found" });
// });

// fs.writeFile()
