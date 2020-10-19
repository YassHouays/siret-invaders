const csvSplitStream = require('csv-split-stream');
const csv = require('csv-parser')
const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const results = [];
const output_folder = 'output/';
const file_source = 'file_source/'
const log = require('log-to-file');


var pm2 = require('pm2');

/**
 * Création du fichier history
 * @param {*} csvResponse 
 */
const writeHistory = (csvResponse) => {
  if (csvResponse){
      const history = []
      
      for (let i=0; i<= csvResponse.totalChunks; i++){
          history.push({
              id : i+1,
              position : 0,
              imported : 0,
              worker : 0
          })
      }

      fs.writeFileSync(output_folder+'history.json', JSON.stringify(history));
  }else{
      return false;
  }
}

let start = new Date();
let hrstart = process.hrtime();

csvSplitStream.split(
  fs.createReadStream(file_source+'StockEtablissement_utf8.csv'),
  {
    lineLimit: 200000
  },
  (index) => fs.createWriteStream(output_folder+`output-${index+1}.csv`),

)

.then(csvSplitResponse => {
  writeHistory(csvSplitResponse)
    setTimeout(function (argument) {
      let end 	= new Date() - start,
      hrend	= process.hrtime(hrstart);
        log('Split effectué en : '+hrend[0]+'secondes', 'my-log.log');
    }, 1);
  console.log('csvSplitStream succeeded.', csvSplitResponse);
  log('Split effectué en : '+csvSplitResponse.totalChunks+'fichiers', 'my-log.log');

}).catch(csvSplitError => {
  console.log('csvSplitStream failed!', csvSplitError);
});
 

