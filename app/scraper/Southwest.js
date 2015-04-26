var request = require('request'),
    models = require('../models/models'),
    cheerio = require('cheerio'),
    curl = require('curlrequest'),
    creds = require('../../config/creds'),
    _ = require('lodash'),
    Pushover = require('node-pushover'),
    push = new Pushover({
      token: creds.pushover.token,
      user: creds.pushover.user_key
    });

var Southwest = (function() {
  var prices;
  
  /**
   * Flight class
   */
  var Flight = function Flight(from, to, date, attrs) {
    // Public vars
    this.from = from;
    this.to = to;
    this.date = date;

    if (attrs && _.isObject(attrs)) {
      for (attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          this[attr] = attrs[attr];
        }
      }
    }

    // Private vars/methods
    
    // Given price in string, remove any characters that's not a digit
    function _cleanUpPrice(price) {
      return price && parseFloat(price.replace(/\D/g,''));
    }

    function _convertDuration(duration) {
      if (!duration) return duration;

      var matches = /(?:(\d*)(?:h|hr))*\s*(?:(\d*)m)*/gi.exec(duration);
      if (!matches[0]) return;

      return parseInt((matches[1] || 0)) * 60 + parseInt((matches[2] || 0));
    }

    // Remove the currency sign in front of the prices
    this.cleanUpPrices = function() {
      var that = this,
          pricesStrings = ['businessPrice', 'businessRewards', 'anytimePrice', 'anytimeRewards', 'getAwayPrice', 'getAwayRewards'];
      
      pricesStrings.forEach(function(priceString) {
        that[priceString] = _cleanUpPrice(that[priceString]);    
      });   
    };

    // Convert duration string into minutes
    this.convertDurationToMinutes = function() {
      this.duration = _convertDuration(this.duration);
    };

    return this;
  };

  // Get all flights for given params
  function _getPrices(fromAirport, toAirport, travelDate, options) {
    console.log(fromAirport, toAirport, travelDate);
    if (!(fromAirport && toAirport && travelDate)) {
      return;
    }

    var formData = {
      selectedOutboundTrip: '',
      selectedInboundTrip: '',
      promoCertSelected:false,
      transitionalAwardSelected:false,
      showAwardToggle:false,
      awardCertificateProductId: '',
      awardCertificateToggleSelected:false,
      oneWayCertificateOrAward:false,
      originAirport: fromAirport,
      originAirport_displayed: fromAirport,
      destinationAirport: toAirport,
      destinationAirport_displayed: toAirport,
      returnAirport: '',
      outboundDateString: travelDate,
      outboundTimeOfDay:'ANYTIME',
      returnTimeOfDay:'ANYTIME',
      adultPassengerCount:1,
      seniorPassengerCount:0,
      promoCode:'',
      modifySearchSubmitButton:'Search',
      bugFareType:'DOLLARS',
      embeddedFareDesignatorPromoCode:'',
      swaBizDiscountSearch:false,
      fareType:'DOLLARS'
    };

    var req = request.post({
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
      },
      url: 'https://www.southwest.com/flight/select-flight.html', 
      form: formData
    }, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        console.log('Scraped');
        var $ = cheerio.load(html),
            $priceRows = $('[id*=outbound_flightRow]'),
            flights = [];

        $priceRows.each(function(idx, $row) {
          var $cells = $(this).children('td'),
              $departCell = $cells.eq(0),
              $arriveCell = $cells.eq(1),
              $routingCell = $cells.eq(3),
              $timeCell = $cells.eq(4),
              $businessPriceCell = $cells.eq(5),
              $anytimePriceCell = $cells.eq(6),
              $getAwayPriceCell = $cells.eq(7),
              flight = {},
              departTime = 0,
              departTimeAmPm,
              arriveTime = 0,
              stops = 0,
              changePlane = false,
              travelTime = 0,
              businessPrice = 0,
              businessRewards = 0,
              anytimePrice = 0,
              anytimeRewards = 0,
              getAwayPrice = 0,
              getAwayRewards = 0,
              pushMessage = '';

          // TODO HIGH: take care of timezone
          // Process depart and arrive time cells
          departTime = $departCell.find('span.bugText').eq(0).text().trim().replace(/\s{2,}/g, ' ');
          arriveTime = $arriveCell.find('span.bugText').eq(0).text().trim().replace(/\s{2,}/g, ' ');
          

          // Process routing cells


          // Process travel time cell
          // TODO HIGH: parse into minutes
          travelTime = $timeCell.find('span.duration').eq(0).text().trim().replace(/\s{2,}/g, ' ');


          // Process prices
          businessPrice = $businessPriceCell.find('.product_price').text().trim().replace(/\s{2,}/g, ' ');
          businessRewards = $businessPriceCell.find('.upsellCurrencyPoints .points').eq(0).text().trim();
          anytimePrice = $anytimePriceCell.find('.product_price').text().trim().replace(/\s{2,}/g, ' ');
          anytimeRewards = $anytimePriceCell.find('.upsellCurrencyPoints .points').eq(0).text().trim();
          getAwayPrice = $getAwayPriceCell.find('.product_price').text().trim().replace(/\s{2,}/g, ' ');
          getAwayRewards = $getAwayPriceCell.find('.upsellCurrencyPoints .points').eq(0).text().trim();



          // console.log(departTime, arriveTime, travelTime, businessPrice, anytimePrice, getAwayPrice);

          flight = new Flight(fromAirport, toAirport, travelDate, {
            depart: departTime,
            arrive: arriveTime,
            duration: travelTime,
            businessPrice: businessPrice || null,
            anytimePrice: anytimePrice || null,
            getAwayPrice: getAwayPrice || null,
            businessRewards: businessRewards || null,
            anytimeRewards: anytimeRewards || null,
            getAwayRewards: getAwayRewards || null
          });

          flight.cleanUpPrices();
          flight.convertDurationToMinutes();
          // console.log(flight);

          // // Compose push message
          // pushTitle = flight.from + '-' + flight.to + ' (' + flight.date + ')';
          // pushMessage = ['Flight: ' + flight.depart + '-' + flight.arrive,
          //                'Duration: ' + flight.duration,
          //                'Business: ' + flight.businessPrice,
          //                'Anytime: ' + flight.anytimePrice,
          //                'Getaway: ' + flight.getAwayPrice].join('\n');

          // push.send(pushTitle, pushMessage);

          // add this flight to returned list
          flights.push(flight);
        });


        // Do cool calculations with flights
        _logPrices(_doCalculations(flights), options.priceWatchId);
      }
      else {
        console.log(error);
        return;
      }
    });

    return req;
  }


  // Log prices to db
  function _logPrices(prices, priceWatchId) {
    models.PriceLog.create({
      lowest_business_price: prices.lowestBusinessPrice,
      lowest_anytime_price: prices.lowestAnytimePrice,
      lowest_get_away_price: prices.lowestGetAwayPrice,
      price_watch_id: priceWatchId
    });
  }


  // Magic function
  function _doCalculations(flights) {
    var comparePriceFunc = function(flight) {
          return flight;
        },
        stats = {
          lowestBusinessPrice: _.min(flights, function(flight) {
            return flight.businessPrice? flight.businessPrice: Infinity;
          }).businessPrice,
          lowestAnytimePrice: _.min(flights, function(flight) {
            return flight.anytimePrice? flight.anytimePrice: Infinity;
          }).anytimePrice,
          lowestGetAwayPrice: _.min(flights, function(flight) {
            return flight.getAwayPrice? flight.getAwayPrice: Infinity;
          }).getAwayPrice,
        };

    console.log(stats);
    return stats;
  }

  return {
    getPrices: _getPrices,
    prices: prices    
  };
})();

module.exports = Southwest;