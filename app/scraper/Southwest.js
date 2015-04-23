var request = require('request'),
    cheerio = require('cheerio'),
    curl = require('curlrequest');

var Southwest = (function() {
  function _getPrices(fromAirport, toAirport, travelDate, options) {
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
              getAwayRewards = 0;

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

          flight = {
            depart: departTime,
            arrive: arriveTime,
            duration: travelTime,
            businessPrice: businessPrice,
            anytimePrice: anytimePrice,
            getAwayPrice: getAwayPrice,
            businessRewards: businessRewards,
            anytimeRewards: anytimeRewards,
            getAwayRewards: getAwayRewards
          };

          console.log(flight);

          // add this flight to returned list
          flights.push(flight);
        });

      }
      else {
        console.log(error);
      }
    });

    return req;
  }



  return {
    getPrices: _getPrices    
  };
})();

module.exports = Southwest;