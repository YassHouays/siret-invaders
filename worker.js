const csvParser = require('csv-parser');
const pm2 = require ('pm2');
const fs = require ('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const { stringify } = require('querystring');
const output_folder = 'output/';

/**
 * connection mongoose
 */
const host = process.env.NOSQL_URL
const connect = mongoose.createConnection(host, { useNewUrlParser: true, useUnifiedTopology: true })
const db = connect.collection(process.env.NOSQL_TABLE);

const worker = process.argv[5]
const datas = [];
fs.createReadStream(output_folder+`output-${process.argv[2]}.csv`)
    .pipe(csvParser())
    .on('data', (row) => datas.push(row))
    .on('end', () => {
         // Get the collection and bulk api artefacts
        bulkUpdateOps = [];    

        datas.forEach(function(doc) {
            bulkUpdateOps.push({ "insertOne": { "document": doc } });

            if (bulkUpdateOps.length === 100000) {
                db.bulkWrite(bulkUpdateOps).then(function(r) {
                    console.log('inserted');
                });
                bulkUpdateOps = [];
            }
        })

        if (bulkUpdateOps.length > 0) {
            db.bulkWrite(bulkUpdateOps).then(function(r) {
                console.log('inserted');
            });
        }

        process.send({
            type: 'worker:fini',
            data: {
                identifier  : process.argv[2],
                worker      : process.argv[5]
            }
        })

    });