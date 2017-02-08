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
      carForYou: 0,
      passengers: 0,
      fastDriving: 0,
      whatCar: 0,
      caring: 0
    };
  });
}

const carManip = {
  setProps: (data) => {
    data.makes.forEach((car) => {
      carManip._category(car);
      carManip._doors(car);
      carManip._hp(car);
      carManip._make(car);
      carManip._prodYear(car);
    });
  },

  _category: (car) => {
    switch (car.category) {
      case 'Sedan':
      case 'Hatchback':
        car.props.carForYou = 1;
        break;
      case 'Wagon':
      case 'Minivan':
      case 'Wagon-Minivan':
        car.props.carForYou = 2;
        break;
      case 'Coupe':
      case 'Roadster':
        car.props.carForYou = 3;
        break;
      case 'Targa':
      case 'Convertible':
        car.props.carForYou = 4;
        break;
      case 'Pick-up':
        car.props.carForYou = 5;
        break;
      case 'Off-road vehicle':
        car.props.carForYou = 6;
        break;
      // case 'SUV':
      // case 'Crossover':
      // case 'Convertible-SUV':
      // case 'Crossover-SUV':
      // case 'Coupe-SUV':
      default:
        car.props.carForYou = 7;
        break;
    }
  },

  _doors: (car) => {
    switch (car.doors) {
      case '2/3':
        car.props.passengers = 1;
        break;
      case '4/5':
        car.props.passengers = 2;
        break;
      case '5/6':
        car.props.passengers = 3;
        break;
    }
  },

  _hp: (car) => {
    const hp = car.hp !== '-' ? parseInt(car.hp) : 0;

    if (hp <= 150) {
      car.props.fastDriving = 1;
    } else if (150 < hp && hp <= 250) {
      car.props.fastDriving = 2;
    } else if (250 < hp && hp < 400) {
      car.props.fastDriving = 3;
    } else if (hp >= 400) {
      car.props.fastDriving = 4;
    }
  },

  _make: (car) => {
    switch (car.make) {
      case 'BMW':
      case 'Mercedes-Benz':
      case 'Audi':
      case 'Volkswagen':
      case 'Bentley':
        car.props.whatCar = 1;
        break;
      case 'Subaru':
      case 'Mitsubishi':
      case 'Honda':
      case 'Lexus':
      case 'Nissan':
      case 'Toyota':
      case 'Mazda':
        car.props.whatCar = 2;
        break;
      case 'Ferrari':
      case 'Porsche':
      case 'Lamborghini':
      case 'Bugatti':
      case 'Maserati':
        car.props.whatCar = 3;
        break;
      case 'Ford':
      case 'Dodge':
      case 'Chevrolet':
      case 'Chrysler':
      case 'Jeep':
      case 'Hummer':
        car.props.whatCar = 4;
        break;
      case 'Alfa Romeo':
      case 'Lancia':
      case 'Fiat':
        car.props.whatCar = 5;
        break;
      case 'Peugeot':
      case 'Citroen':
      case 'Renault':
      case 'DS':
        car.props.whatCar = 6;
        break;
      default:
        car.props.whatCar = 7;
        break;
    }
  },

  _prodYear: (car) => {
    const beginY = car.beginYear !== '-' ? parseInt(car.beginYear) : 1999;
    const endY = car.endYear !== '-' ? parseInt(car.endYear) : (new Date()).getFullYear();
    const prod = beginY + Math.round(Math.abs(beginY - endY));

    if (prod <= 1980) {
      car.props.caring = 1;
    } else if (1980 < prod && prod <= 1995) {
      car.props.caring = 2;
    } else if (1995 < prod && prod <= 2008) {
      car.props.caring = 3;
    } else if (prod >= 2009) {
      car.props.caring = 4;
    }
  }
};


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

  // // >>> Set props based on questions
  // carManip.setProps(data);
  // save(data, 'car-data-flat');

  console.log(data.makes.length);
  // Remove cars with zero props
  data.makes = data.makes.filter((car) => {
    return !Object.keys(car.props).find(key => car.props[key] === 0);
  });
  console.log(data.makes.length);
  save(data, 'car-data-flat-filtered-props');
}

init();
