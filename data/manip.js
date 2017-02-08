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

function makeFlat(data) {
  const flat = { makes: [] };

  data.makes.forEach((make) => {
    make.models.forEach((model) => {
      model.trims.forEach((trim) => {
        trim.types.forEach((type) => {
          flat.makes.push({
            make: make.make,
            model: model.model,
            trim: trim.trim,
            engine: type.engine,
            hp: type.hp,
            category: type.category,
            doors: type.doors,
            beginYear: type.beginYear,
            endYear: type.endYear,
            url: type.url
          });
        });
      });
    });
  });

  return flat;
}

function setInitProps(data) {
  data.makes.forEach((obj) => {
    obj.props = {
      gender: 0,
      ageGroup: 0,
      relationship: 0,
      climate: 0,
      autoSport: 0,
      speedLimits: 0,
      usageReason: 0
    };
  });
}

function setPropValues(data) {
  data.makes.forEach((car) => {
    const hp = car.hp !== '-' ? parseInt(car.hp) : 0;
    const beginY = car.beginYear !== '-' ? parseInt(car.beginYear) : 1999;
    const endY = car.endYear !== '-' ? parseInt(car.endYear) : (new Date()).getFullYear();
    const prod = beginY + Math.round(Math.abs(beginY - endY));

    // Category
    switch (car.category) {
      case 'Sedan':
        break;
      case 'Hatchback':
        break;
      case 'Coupe':
      case 'Roadster':
        break;
      case 'Targa':
      case 'Convertible':
        break;
      case 'Wagon':
      case 'Minivan':
      case 'Wagon-Minivan':
        break;
      case 'Pick-up':
        break;
      case 'Off-road vehicle':
        break;
      case 'SUV':
      case 'Crossover':
      case 'Convertible-SUV':
      case 'Crossover-SUV':
      case 'Coupe-SUV':
        break;
    }

    // Make
    switch (car.make.toLowerCase()) {
      case 'bmw':
      case 'mercedes':
        break;
    }

    // Model
    switch (car.model.toLowerCase()) {
      case '':
        break;
    }

    // HP
    if (hp <= 150) {

    } else if (150 < hp && hp <= 250) {

    } else if (250 < hp && hp < 400) {

    } else if (hp >= 400) {

    }

    // Prod year
    if (prod <= 1980) {

    } else if (1980 < prod && prod <= 1995) {

    } else if (1995 < prod && prod <= 2008) {

    } else if (prod >= 2009) {

    }
  });
}

function init() {
  const data = JSON.parse(fs.readFileSync(__dirname + '/car-data-flat.json', 'utf8'));

  // // >>> Standardize doors
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

  // // >>> Standardize categories
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

  // // >>> Reduce similar types
  // reduceSimilarTypes(data);
  // save(data, 'car-data-processed');

  // // >>> Make flat
  // const flat = makeFlat(data);
  // save(flat, 'car-data-flat');

  // // >>> Set initial props
  // setInitProps(data);
  // save(data, 'car-data-flat');
}

init();
