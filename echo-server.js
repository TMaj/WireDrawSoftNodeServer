const WebSocket = require('ws');
const stateHelper = require('./src/state_helper')

const wss = new WebSocket.Server({ port: 8080 }); 

const hardwareControllerId = 'wds-hardware-controller';

let state = {
  "type" : "update",
  "currentTemperature": "23",
  "desiredTemperature": "23",
  "engine1Direction": "1",
  "engine1Speed": "0",
  "engine2Direction": "0",
  "engine2Speed": "0",
};

let status = {
  "type" : "status",
  "connectedToEngines" : false,
  "connectedToHardwareController" : false
}
 
let elongation = {
  "type" : "elongation",
  "leftLength" : "0",
  "rightLength": "0"
}

const updateState = (obj) => { 

  console.log('Updating state');
  console.log(JSON.stringify(obj));
  if (obj.currentTemperature !== undefined) { 
    state.currentTemperature = obj.currentTemperature.toString();
  }
  if (obj.desiredTemperature !== undefined) { 
    state.desiredTemperature = obj.desiredTemperature.toString();
  }
  if (obj.engine1Direction !== undefined) { 
    state.engine1Direction = obj.engine1Direction.toString();
  }
  if (obj.engine1Speed !== undefined) { 
    state.engine1Speed = obj.engine1Speed.toString();
  }
  if (obj.engine2Direction !== undefined) { 
    state.engine2Direction = obj.engine2Direction.toString();
  }
  if (obj.engine2Speed !== undefined) { 
    state.engine2Speed = obj.engine2Speed.toString();
  }
}

const updateStatus = (obj) => { 
  if (obj.connectedToEngines !== undefined) { 
    status.connectedToEngines = obj.connectedToEngines;
  } 
  if (obj.connectedToHardwareController !== undefined) { 
    status.connectedToHardwareController = obj.connectedToHardwareController;
  } 
}

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending');
      console.log(JSON.stringify(status));
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) { 
  console.log(req.headers['user-agent']);

  if (req.headers['user-agent'] && req.headers['user-agent'].includes(hardwareControllerId)) { 
    console.log('Hardware controller connected!');
    updateStatus({ connectedToHardwareController: true});  
    wss.broadcast(JSON.stringify(status));

    ws.on('close', function closing() {
      console.log('Closed hardware connection!');
      updateStatus({connectedToEngines: false, connectedToHardwareController: false}); 
      wss.broadcast(JSON.stringify(status));
    });
  }

  if (ws.readyState === WebSocket.OPEN) { 
    console.log('Sending');
    console.log(JSON.stringify(status));
    console.log(JSON.stringify(state));

    ws.send(JSON.stringify(status)); 
    ws.send(JSON.stringify(state)); 
  }

  ws.on('message', function incoming(data) { 
    console.log('Message received'); 
    console.log(data);
    const obj = JSON.parse(data);

    let toSend;

    switch (obj.type) {
      case 'status':
          updateStatus(obj);
          toSend = status; 
          break;
      case 'update':
          updateState(obj);
          toSend = state;  
          break;
      default:
          toSend = obj;          
    } 

    // Broadcast to everyone else but sender.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {  
        console.log('Sending');
        console.log(JSON.stringify(toSend));
        client.send(JSON.stringify(toSend));
      }
    });
  });
});