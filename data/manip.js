'use strict';

const fs = require('fs');

function save(data, fileName) {
  fs.writeFile(`${__dirname}/${fileName}.json`, JSON.stringify(data), (err) => {
    if (err) {
      return console.log(err);
    }

    console.log('File saved!');
  });
}

function getCategories(data) {
  const cats = {};

  data.makes.forEach((make) => {
    make.models.forEach((model) => {
      model.trims.forEach((trim) => {
        trim.types.forEach((type) => {
          cats[type.category] = true;
        });
      });
    });
  });

  return Object.keys(cats);
}

function init() {
  const data = JSON.parse(fs.readFileSync(__dirname + '/car-data.json', 'utf8'));
  // console.log(getCategories(data));
}

init();
