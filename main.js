const csvParser = require('csv-parser');
const pm2 = require ('pm2');
const fs = require ('fs');
const { stringify } = require('querystring');
const output_folder = 'output/';

const findTask = (worker,per_worker) => {
        let history = fs.readFileSync(output_folder+'history.json');
        history = JSON.parse(history);
    
        let i = 0;
        const found = history.filter(function(item){
            if (item.imported==0 && i == 0 ){
                if(item.id > (worker == 1 ? 0 : per_worker * (worker - 1)) && item.id < per_worker * (worker + 1) ){
                    item.imported = 1,
                    item.worker = worker
                    i++;
                    return true;
                }
                return false;
            }
            return false;
        })
        fs.writeFileSync(output_folder+'history.json',JSON.stringify(history));
        return (found.length>0)? found[0] : null;
    }


const closeTask = (id,worker)=>{
    let history = fs.readFileSync(output_folder+'history.json');
    history = JSON.parse(history);

    history.filter(function(item){
        if (item.id == id){
            item.imported = 3,
            item.worker = worker
            item.position = 200000
            return true;
        }
        return false;
    });
    fs.writeFileSync(output_folder+'history.json', JSON.stringify(history));
}
function checkWorkersExist(start,hrstart) { 
    pm2.list((err, list) => {
        if(list.length > 0){
            setTimeout(() => {
            checkWorkersExist(start,hrstart)
            }, 4000);
        }else{
            let end 	= new Date() - start,
                hrend	= process.hrtime(hrstart);
            
            console.log(`Import files in ${hrend[0]}s (${end}ms)`);
            console.log(`All datas are imported !`);
            process.exit();
        }
    });
}

pm2.connect(function(err) {
    
    if (err) {
      process.exit(2);
    }
    
    pm2.list((err, list) => {
    //   console.log(err, list)
    })
    
    let history = fs.readFileSync(output_folder+'history.json');
    history = JSON.parse(history);

    let start = new Date();
    let hrstart = process.hrtime();

    const per_worker = Math.round(history.length / 10);
    let findTaske=[];
    for (let i=1; i <10 ; i++){
        findTaske = findTask(i, per_worker);
       if(findTaske)
        {
            const pm2Config = {
                script              : 'worker.js',
                exec_mode           : 'cluster',
                max_memory_restart  : '100M',
                args                : ""+findTaske.id+" "+findTaske.position+" "+findTaske.imported+" "+String(i)+"",
                name                : String(i),
                instances           : 1
            };
            pm2.start(pm2Config, (err, apps) => {
                if (err) throw err
            });
            findTaske=[];
        }
        else{
            // process.exit();
        }
    }

    pm2.launchBus(function(err, bus) {
        bus.on('worker:fini', function(packet) {
            const pmID = packet.process.pm_id
            const worker = packet.data.worker
            const next = pmID

            closeTask(pmID,worker);
            pm2.delete(pmID);
            let nextTask =[]; 
            setTimeout(()=> {
                nextTask = findTask(worker, per_worker);
                if(nextTask){
                    console.log(nextTask);
                }
                if (nextTask){
                    const pm2Config = {
                        script              : 'worker.js',
                        exec_mode           : 'cluster',
                        max_memory_restart  : '100M',
                        args                :  ""+nextTask.id+" "+nextTask.position+" "+nextTask.imported+" "+next+"",
                        name                : String(next),
                        instances           : 1
                    };
                    pm2.start(pm2Config, (err,apps)=>{
                        if (err) throw err
                    });
                }
                else {
                    checkWorkersExist(start,hrstart);
                }
                   
            },4000)
        });
    });
});