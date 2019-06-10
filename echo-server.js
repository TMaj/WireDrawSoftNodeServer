const WebSocket = require('ws');
const path = require('path'); 
const fork = require('child_process').fork; 

const stateHelper = require('./src/helpers/state_helper');
const msgHelper = require('./src/helpers/message_helper');

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

const wss = new WebSocket.Server({ port: 8080 });  
const state = stateHelper.initializeState(); 

// Broadcast to all.
wss.broadcast = function broadcast(message) { 
  wss.clients.forEach(client => {    
    if (client.readyState === WebSocket.OPEN && msgHelper.isSocketTypeSubscribedToMessage(message, client.type)) {  
      client.send(JSON.stringify(message));
    }
  });
}; 

// Broadcast to all, except sender
wss.partialBroadcast = function(message, senderClient) {
  wss.clients.forEach(client => {
    if (client !== senderClient && client.readyState === WebSocket.OPEN && msgHelper.isSocketTypeSubscribedToMessage(message, client.type)) { 
      client.send(JSON.stringify(message));
    }
  });
}

// Broadcast to all, except sender
wss.sendToType = function(message, clientType) {
  wss.clients.forEach(client => {
    if (client.type === clientType && client.readyState === WebSocket.OPEN) { 
      client.send(JSON.stringify(message));
    }
  });
}

elongationService.on('message', message => {
  const toSend = stateHelper.updateState(state, message);
  wss.broadcast(toSend);
}); 

autoProgramService.on('message', message => {
  const toSend = stateHelper.updateState(state, message);
  if (toSend.type === msgHelper.messageTypes.UPDATE) { 
    wss.sendToType(toSend, msgHelper.socketTypes.HARDWARE);
  } else { 
    wss.broadcast(toSend);
  }
});  

statisticsService.on('message', message => {
  const toSend = stateHelper.updateState(state, message);
  wss.broadcast(toSend);
}); 

elongationService.stdout.on('data', data => { 
  console.log(`\x1b[33m  ${data } \x1b[0m`); 
});

autoProgramService.stdout.on('data', data => { 
  console.log(`\x1b[35m  ${data.toString('utf8')} \x1b[0m`); 
}); 

statisticsService.stdout.on('data', data => { 
  console.log(`\x1b[36m  ${data.toString('utf8')} \x1b[0m`); 
});

wss.on('connection', function connection(ws, req) { 
  const socketType = msgHelper.getSocketType(req.headers['user-agent']); 
  ws.type = socketType; 

  if (ws.type === msgHelper.socketTypes.HARDWARE) { 
    console.log('Hardware controller connected!'); 
    state.status.connectedToHardwareController = true; 
    wss.broadcast(state.status);

    ws.on('close', function closing() {
      console.log('Closed hardware connection!');
      state.status.connectedToHardwareController = false;
      state.status.connectedToEngines = false; 

      state.currentState.desiredTemperature = 0;
      state.currentState.engine1Speed = 0;
      state.currentState.engine2Speed =0;

      wss.broadcast(state.status);
      wss.broadcast(state.currentState);
    });
  }

  if (ws.readyState === WebSocket.OPEN) { 
    console.log(`Sending initial states for newly connected ${socketType}`); 

    ws.send(JSON.stringify(state.currentState)); 
    ws.send(JSON.stringify(state.status));
    ws.send(JSON.stringify(state.reel));
    ws.send(JSON.stringify(state.elongation));
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

      if (toSend.type === msgHelper.messageTypes.UPDATE || toSend.type === msgHelper.messageTypes.COMMAND) { 
        wss.partialBroadcast(toSend, ws); 
      } else {
        wss.broadcast(toSend);
      }

    }
    catch (error) {
      console.log(error);
    } 
  });
});