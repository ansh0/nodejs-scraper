// Promise based HTTP client for the browser and node.js
const axios = require('axios');

// define Jquery and get DOM objects on the server side 
const cheerio = require('cheerio');

// direct write json object in CSV file 
const ObjectsToCsv = require('objects-to-csv');
// Encoding for Spanish characters properly
var iso88592 = require('iso-8859-2');

const url = 'https://www.example.com';

console.log("=======> Scraping has been Started, Please wait <========")

axios(url, { responseType: 'arraybuffer', responseEncoding: 'binary' })
  .then(response => {
    let html = iso88592.decode(response.data.toString('binary'));
    // const html = response.data;
    const $ = cheerio.load(html);
    const accordianDivs = $('#accordion > div > table > tbody > tr > td');
    const playersData = [];
    console.log(accordianDivs.length);

    accordianDivs.each(function () {
      let checkBold = $(this).find("b")
      if (checkBold.length === 0) {
        const playerDetailText = $(this).text().split(" ")  
        let pFirstNmae = playerDetailText[0]
        let pLastName = playerDetailText[1]
        let action = $(this).text().slice((playerDetailText[0].length+1) + (playerDetailText[1].length+1), -1)
        playersData.push({
          // playerDetailInfo: playerDetailText
          playerName: ((pFirstNmae && pLastName) ? pFirstNmae + " " + pLastName : (pFirstNmae || pLastName)),
          action: action
        });
      }
    });
    console.log(playersData);
    printCsv(playersData)
  })
  .catch(console.error);

async function printCsv(data) {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk('./playersDetail.csv');
  console.log("=======> Created playersDetail.csv in project directory. please check the file. <========")
  console.log("=======> Scraping has been Finished <========")
}