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

// if (!process.argv[2]) {
//     return false;
// }

const data = [];
fs.createReadStream(output_folder+`output-${process.argv[2]}.csv`)
    .on('error', () => {
        // handle error
    })

    .pipe(csvParser())
    .on('data', (row) => {
       data.push(row);
    })

    .on('end', () => {
        // handle end of CSV
        db.insertMany(data, function(err,result){
            if (err){
                console.log('erreur');
            }
            else{
                process.send({
                    type: 'worker:fini',
                    data: {
                        identifier : process.argv[2],
                    } 
                })
            }
        })
    })

