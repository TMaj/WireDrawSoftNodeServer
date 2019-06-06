const WebSocket = require('ws');
 
const ws = new WebSocket('ws://127.0.0.1:8080');
 
const program = {
	type: "autoProgram",
	steps: [
	{time: 5, engine1Speed: 1, engine1Direction: 1, engine2Speed: 2, engine2Direction: 2, desiredTemperature: 200},
	{time: 5, engine1Speed: 2, engine1Direction: 1, engine2Speed: 2, engine2Direction: 2, desiredTemperature: 200},
	{time: 5, engine1Speed: 3, engine1Direction: 1, engine2Speed: 2, engine2Direction: 2, desiredTemperature: 200},
	{time: 5, engine1Speed: 4, engine1Direction: 1, engine2Speed: 2, engine2Direction: 2, desiredTemperature: 200},
	{time: 5, engine1Speed: 5, engine1Direction: 1, engine2Speed: 2, engine2Direction: 2, desiredTemperature: 200},
	],
} 

const status = {
	type: "status",
	autoProgram: true,
} 
 
 
ws.on('open', function open() {
  ws.send(JSON.stringify(program));
  ws.send(JSON.stringify(status)); 
});