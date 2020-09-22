const csvParser = require('csv-parser');
const pm2 = require ('pm2');
const fs = require ('fs');
const { stringify } = require('querystring');


pm2.connect(function(err) {
    if (err) {
      process.exit(2);
    }
    
    pm2.list((err, list) => {
      console.log(err, list)
    })
    
    for (let i=1; i <=6 ; i++){
        const pm2Config = {
            script              : 'worker.js',
            exec_mode           : 'cluster',
            max_memory_restart  : '100M',
            args                : ""+String(i)+"",
            name                : String(i),
            instances           : 1
        };
        pm2.start(pm2Config, (err, apps) => {
            if (err) throw err
        });

    }

    pm2.launchBus(function(err, bus) {
        bus.on('worker:fini', function(packet) {
            const pmID = packet.process.pm_id
            pm2.delete(pmID);
        });
    });

});