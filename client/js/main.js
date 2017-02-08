/* jshint ignore:start */

$(function () {
  'use strict';

  var AUTO_DATA_URL = 'http://auto-data.net/en/',
      $carForYou = $('#q-car-for-you'),
      $passengers = $('#q-passengers'),
      $fastDriving = $('#q-fast-driving'),
      $whatCar = $('#q-what-car'),
      $caring = $('#q-caring'),
      $carCard = $('#car-card');

  function getPhoto(url) {
    return new Promise((res, rej) => {
      $.get(url, function (html) {
        var $html = $(html);
        res(url);
      });
    })
  }

  // Activate Materialized select
  $('select').material_select();

  // Handle submit clicks
  $('#submit').on('click', function () {
    var obj = {
      carForYou: parseInt($carForYou.val()),
      passengers: parseInt($passengers.val()),
      fastDriving: parseInt($fastDriving.val()),
      whatCar: parseInt($whatCar.val()),
      caring: parseInt($caring.val())
    };

    if (!Object.keys(obj).find(key => isNaN(obj[key]))) {
      // Send to BE; Currently mocked
      $.get('./data/car-mock.json', function (car) {
        var $table, $cardCont,
            adUrl = AUTO_DATA_URL + car.url;

        getPhoto().then((url) => {

        });

        // Can be optimized
        $carCard.find('.card-title').html(car.make + ' ' + car.model);
        $carCard.find('.trim').html(car.trim);
        $carCard.find('.card-action').children().first().attr('href', adUrl);

        $table = $('<table><tr><td></td><td></td></tr></table>');

        $table.find('tr').children().first()
          .append('<ul>'
            + '<li>Engine: <strong>' + car.engine + '</strong></li>'
            + '<li>HP: <strong>' + car.hp + '</strong></li>'
            + '<li>Category: <strong>' + car.category + '</strong></li>'
            + '</ul>');

        $table.find('tr').children().last()
          .append('<ul>'
            + '<li>Doors: <strong>' + car.doors + '</strong></li>'
            + '<li>Start of Production: <strong>' + car.beginYear + '</strong></li>'
            + '<li>End of Production: <strong>' + car.endYear + '</strong></li>'
            + '</ul>');

        $cardCont = $carCard.find('.card-content');
        $cardCont.find('table').remove();
        $cardCont.append($table);

        $carCard.fadeIn();
      });
    }
  });
});
