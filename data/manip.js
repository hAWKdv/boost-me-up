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

function getProp(data, prop) {
  const types = {};

  data.makes.forEach((make) => {
    make.models.forEach((model) => {
      model.trims.forEach((trim) => {
        trim.types.forEach((type) => {
          types[type[prop]] = true;
        });
      });
    });
  });

  return Object.keys(types);
}

function standardize(data, prop, map) {
  data.makes.forEach((make) => {
    make.models.forEach((model) => {
      model.trims.forEach((trim) => {
        trim.types.forEach((type) => {
          const mapTo = map[type[prop]];
          if (mapTo) {
            type[prop] = mapTo;
          }
        });
      });
    });
  });
}

function reduceSimilarTypes(data) {
  const hpTolerance = 20;

  data.makes.forEach((make) => {
    make.models.forEach((model) => {
      model.trims.forEach((trim) => {
        const qualifiedTypes = [];
        let lastQualified;

        trim.types.forEach((type, idx) => {
          if (
            idx === 0 ||
            Math.abs(lastQualified.hp - type.hp) >= hpTolerance ||
            lastQualified.category !== type.category ||
            lastQualified.doors !== type.doors
          ) {
            qualifiedTypes.push(type);
            lastQualified = type;
          }
        });

        trim.types = qualifiedTypes;
      });
    });
  });
}

function init() {
  const data = JSON.parse(fs.readFileSync(__dirname + '/car-data-processed.json', 'utf8'));

  // Standardize doors

  // const doorMap = {
  //   '4+1': '4/5',
  //   '4(5)': '4/5',
  //   '2(3)': '2/3',
  //   '2/4': '2/3',
  //   '3/5': '4/5',
  //   '6': '5/6',
  //   '5': '4/5',
  //   '4': '4/5',
  //   '3': '2/3',
  //   '2': '2/3'
  // };
  // standardize(data, 'doors', doorMap);

  // Standardize categories

  // const catMap = {
  //   'Combi': 'Wagon',
  //   'MPV': 'Minivan',
  //   'Minivan, MPV': 'Minivan',
  //   'Combi, MPV': 'Wagon-Minivan',
  //   'Cabriolet': 'Convertible',
  //   'Coupe, SUV': 'Coupe-SUV',
  //   'Cabriolet, SUV': 'Convertible-SUV',
  //   'Coupe - Cabriolet': 'Convertible',
  //   'SUV, Crossover': 'Crossover-SUV'
  // };
  // standardize(data, 'category', catMap);
  // console.log(getProp(data, 'category'));

  // Reduce similar types
  reduceSimilarTypes(data);

  save(data, 'car-data-processed');
}

init();
