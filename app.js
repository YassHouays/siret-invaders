const csvSplitStream = require('csv-split-stream');
const csv = require('csv-parser')
const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const results = [];
const output_folder = 'output/';
const file_source = 'file_source/'
var pm2 = require('pm2');

csvSplitStream.split(
  fs.createReadStream(file_source+'StockEtablissement_utf8.csv'),
  {
    lineLimit: 200000
  },
  (index) => fs.createWriteStream(output_folder+`output-${index}.csv`),

)
.then(csvSplitResponse => {
  utils.writeHistory(csvSplitResponse);
  console.log('csvSplitStream succeeded.', csvSplitResponse);
}).catch(csvSplitError => {
  console.log('csvSplitStream failed!', csvSplitError);
});
 

