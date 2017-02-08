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
        var $table, $cardCont;

        // Can be optimized
        $carCard.find('.card-title').html(car.make + ' ' + car.model);
        $carCard.find('.trim').html(car.trim);
        $carCard.find('.card-action').children().first().attr('href', AUTO_DATA_URL + car.url);

        $table = $('<table><tr><td></td><td></td></tr></table>');

        $table.find('tr').children().first()
          .append('<ul>'
            + '<li>Двигател: <strong>' + car.engine + '</strong></li>'
            + '<li>КС: <strong>' + car.hp + '</strong></li>'
            + '<li>Категория: <strong>' + car.category + '</strong></li>'
            + '</ul>');

        $table.find('tr').children().last()
          .append('<ul>'
            + '<li>Врати: <strong>' + car.doors + '</strong></li>'
            + '<li>Начало производство: <strong>' + car.beginYear + '</strong></li>'
            + '<li>Край производство: <strong>' + car.endYear + '</strong></li>'
            + '</ul>');

        $cardCont = $carCard.find('.card-content');
        $cardCont.find('table').remove();
        $cardCont.append($table);

        $carCard.fadeIn();
      });
    }
  });
});
