var request = require('request'),
    cheerio = require('cheerio');

var pricer = {
  updatePrices: function(models) {
    models.Item.findAll().then(function(items) {
      items.forEach(function(item) {
        if (item.url) {
          // Scrape the price of current item given URL
          request(item.url, function (error, response, html) {
            // If all is fine
            if (!error && response.statusCode == 200) {
              var $ = cheerio.load(html),
                  title,
                  price,
                  priceChanged = false;

              // if (item.id == 9) {
              //   var matches = $.html().match(/productTitle/gi);
              //   console.log(matches);
              // }

              try {
                price = parseFloat($('.priceLarge')[0].children[0].data.match(/(\d*\.*\d+)/g)[0]); // This '.priceLarge' class can change. TODO: find a more reliable element

                // If parsed price is valid and different from current price
                if (!isNaN(price) && price !== item.price) {
                  priceChanged = true;
                  item.price = price;
                }

                // Title is a bit flaky
                try {
                  title = $('title')[0].children[0].data.split(':')[1].trim(); // Amazon product title has the form 'Amazon.com : <product name> : category : category, etc.'

                  // If the title has changed update
                  if (title !== item.name) {
                    item.name = title;
                  }
                }

                catch(e) {
                  console.error('Failed to grab title for item ' + item.id);
                }
                
                item.save().then(function() {
                  if (priceChanged) {
                    models.PriceLog.create({
                      'item_id': item.id,
                      price: price
                    });
                  }
                });
              }
              catch(e) {
                console.error('Failed to update price or title for item ' + item.id);
              }
              
            }
          });
        }
        else {
          console.error('Item: ' + item.id + ' does not have a URL');
        }
      });  
    });
  }
};

module.exports = pricer;