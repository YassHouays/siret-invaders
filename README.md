# siret-invaders

This is a school project, You need to build a high-volume ```mongodb indexer``` for the government to transition ```data in csv format to a NoSQL database```

### INSTALLATION
Download the CSV file ```"Sirene : Fichier StockEtablissement"``` here : https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/ 
Download this project with git clone : ``` git clone https://github.com/YassHouays/siret-invaders.git ``` </Br>
And install it with ```npm install```

### CONFIG 
You have to create a .env file with a variable ```NOSQL_URL=mongodb://localhost:27017/siret-invaders``` -> replace it with you'r url and an other variable : ```NOSQL_TABLE=sirets``` with you'r own table.

### METHOD 

To start the project you have differents command to use but first of all you have some steps to do : 

  - In a folder ```file_source``` , you have to put you'r file ```csv StockEtablissement_utf8```
  
  - Create a folder ```output``` and a file call ```history.json``` when you have done this you can run the app

  - ```node app.js``` this command allow you to read the CSV file, split it in a multiple of different file and fill the history file.
  
  - ```node main.js``` Then you can run the main script who allow you to create instances,workers, convert the csv files in json, and insert it in mongodb


Here i will explain you some specificity of the code : 

### APP.JS

In this file you will be able to adapt the limit of lines in each files. 

```
csvSplitStream.split(
  fs.createReadStream(file_source+'StockEtablissement_utf8.csv'),
  {
    lineLimit: 200000
  },
  (index) => fs.createWriteStream(output_folder+`output-${index+1}.csv`),

)
```
Change the variable ```lineLimit``` with the limit you want.

### MAIN.JS

You can ask to you'r script how many workers do you want here by changing the '6' for my exemple i'm using 6 workers:  

```const per_worker = Math.round(history.length / 6);
    let findTaske=[];
    for (let i=1; i <=6 ; i++){```
    
  
