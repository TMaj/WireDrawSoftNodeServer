const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const Op = Sequelize.Op;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const Preset = sequelize.define('Preset', { 
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    speed1: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    speed2: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    temperature: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }  
  });

  const Session = sequelize.define('Session', {    
    start: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false
    },
  });

  const Statistics = sequelize.define('Statistics', {
    time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    engine1Speed: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    engine2Speed: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    currentTemperature: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }  
  });

Preset.sync();
Session.sync();
Statistics.sync();

exports.getAllPresets = async function getAllPresets() {
    return await Preset.findAll();
}

exports.addPreset = async function addPreset(preset) {
  return  await Preset.create(preset);
}

exports.deletePreset = async function deletePreset(presetId) {
  return await Preset.destroy({
    where: {
      id: presetId
    }
  }).then(() => {
    console.log(`Preset with id ${presetId} deleted`);
  });
}

exports.getAllSessions = async function getAllSessions() {
  return await Session.findAll();
}

exports.saveSession = async function saveSession(session) {
  return await Session.create(session);
}

exports.saveStatistics = async function saveStatistics(statistics) {
   return await Statistics.create(statistics);
}

exports.getAllStatistics = async function getAllStatistics() {
  return await Statistics.findAll();
}

exports.getStatisticsBetween = async function getStatisticsBetween(begin, end) {
  const statistics = await Statistics.findAll({
    where: {
      time: {
        [Op.and] : {
          [Op.gt] : begin,
          [Op.lt] : end,
        }
      }
    }
  }); 

  const parsedStatistics = statistics.map(s => { 
    const cultureCode = 'pl-PL'; 
    return {
      date: new Date(s.time).toLocaleDateString(cultureCode),
      time: new Date(s.time).toLocaleTimeString(cultureCode),
      engine1Speed: s.engine1Speed,
      engine2Speed: s.engine2Speed,
      currentTemperature: s.currentTemperature,
    };
  });

  return parsedStatistics;
}