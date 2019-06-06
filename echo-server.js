const WebSocket = require('ws');
const path = require('path'); 
const fork = require('child_process').fork; 

const stateHelper = require('./src/helpers/state_helper');

const elongationServicePath = path.resolve('./src/services/elongation_service.js');
const autoProgramServicePath = path.resolve('./src/services/auto_program_service.js');
const statisticsServicePath = path.resolve('./src/services/statistics_service');

const parameters = [];
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

const elongationService = fork(elongationServicePath, parameters, options);
const autoProgramService = fork(autoProgramServicePath, parameters, options);
const statisticsService = fork(statisticsServicePath, parameters, options);

elongationService.on('message', message => {
  console.log('ElongationService', JSON.stringify(message));
}); 

autoProgramService.on('message', message => {
  console.log('AutoProgramService', JSON.stringify(message));
});  

statisticsService.on('message', message => {
  console.log('StatisticsService', JSON.stringify(message));
});

statisticsService.stdout.on('data', function(data) {
  console.log(data.toString()); 
});

const wss = new WebSocket.Server({ port: 8080 }); 

const hardwareControllerId = 'wds-hardware-controller';

const state = stateHelper.initializeState(); 

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) { 
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) { 
  console.log(req.headers['user-agent']);

  if (req.headers['user-agent'] && req.headers['user-agent'].includes(hardwareControllerId)) { 
    console.log('Hardware controller connected!'); 
    state.status.connectedToHardwareController = true; 
    wss.broadcast(JSON.stringify(state.status));

    ws.on('close', function closing() {
      console.log('Closed hardware connection!');
      state.status.connectedToHardwareController = false;
      state.status.connectedToEngines = false; 

      wss.broadcast(JSON.stringify(state.status));
    });
  }

  if (ws.readyState === WebSocket.OPEN) { 
    // console.log('Sending');
    // console.log(JSON.stringify(state.currentState));
    // console.log(JSON.stringify(state.status));

    ws.send(JSON.stringify(state.currentState)); 
    ws.send(JSON.stringify(state.status)); 
  }

  ws.on('message', function incoming(data) { 
    try {
      console.log('Message received'); 
      console.log(data);
      const obj = JSON.parse(data);

      const toSend = stateHelper.updateState(state, obj);
      elongationService.send(toSend);
      autoProgramService.send(toSend); 
      statisticsService.send(toSend);
   
      stringToSend = JSON.stringify(toSend); 

      // Broadcast to everyone else but sender.
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {  
          // console.log('Sending');
          // console.log(JSON.stringify(toSend)); 
          client.send(stringToSend);
        }
      });

    }
    catch (error) {
      console.log(error);
    }

  });
});