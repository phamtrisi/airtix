var fs = require("fs"),
    csv = require("fast-csv");

var stream = fs.createReadStream("transactions.csv"),
    transData = [];

csv
  .fromStream(stream, {
    headers: ['date', 'vendor', 'originalDescription', 'amount', 'transactionType', 'category', 'accountName', 'labels', 'notes'], // can be 'true' to get the default headers
    ignoreEmpty: true
  })
  .transform(function(data){
   // Change the date column to Epoc time
   data.date = new Date(data.date).getTime();
   return data;
  })
  .on("data", function(data){
    transData.push(data);
  })
  .on("end", function(){
    console.log("done reading, writing JSON");
    transData.splice(0,1);
    fs.writeFile('app/data/transactions.json', JSON.stringify(transData), function (err,data) {
      if (err) {
        return console.log(err);
      }
    });
  });