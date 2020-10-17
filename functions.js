const fs = require('fs');
const config = require("./config");
const output_folder = 'output/';


/**
 * 
 * @param {*} csvResponse 
 */
const writeHistory = (csvResponse) => {
    if (csvResponse){
        const history = []
        
        for (let i=0; i<= csvResponse.totalChunks; i++){
            history.push({
                id : i,
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

exports.writeHistory = writeHistory;