    // // Load the TCP Library
    // net = require('net');
     
    // // Keep track of the chat clients
    // var clients = [];
     
    // // Start a TCP Server
    // net.createServer(function (socket) {
     
    //   // Identify this client
    //   socket.name = socket.remoteAddress + ":" + socket.remotePort
     
    //   // Put this new client in the list
    //   clients.push(socket);
     
    //   // Send a nice welcome message and announce
    //   socket.write("Welcome " + socket.name + "\n");
           
    //   // Handle incoming messages from clients.
    //   socket.on('data', function (data) {
    //     console.log(data);
    //   });
     
    //   // Remove the client from the list when it leaves
    //   socket.on('end', function () {
    //     clients.splice(clients.indexOf(socket), 1);
    //   });
     
    //   socket.on('error', function(e){
    //         console.log(e);
    //   });

    // }).listen(8080);
     
    // // Put a friendly message on the terminal of the server.
    // console.log("Chat server running at port 8080\n");

    // const io = require('socket.io');

    // const socket = io('http://localhost:8080');
    // // var socket = new io.Socket('localhost',{
    // //   port: 8080
    // // });
    // socket.connect(); 
    
    // // Add a connect listener
    // socket.on('connect',function() {
    //   console.log('Client has connected to the server!');
    //   sendMessageToServer('test');
    // });
    // // Add a connect listener
    // socket.on('message',function(data) {
    //   console.log('Received a message from the server!',data);
    // });
    // // Add a disconnect listener
    // socket.on('disconnect',function() {
    //   console.log('The client has disconnected!');
    // });
    
    // // Sends a message to the server via sockets
    // function sendMessageToServer(message) {
    //   socket.send(message);
    // }

// const net = require('net');
// const client = net.createConnection({ port: 8080 }, () => {
//   // 'connect' listener
//   console.log('connected to server!');
//   client.write('"<message><subscription><port>8090</port> <clientId>\'web-client\'</clientId></subscription></message>');

//   client.on('data', function (data) {
//     console.log('Response from server ' + data);
//   });
//   client.write('"<message><update><speed1>123</speed1><speed2>222</speed2> <temperature>12</temperature></update></message>');
//   client.on('data', function (data) {
//     console.log('Response from server ' + data);
//   });


//   client.on('data', function (data) {
//     console.log('Response from server ' + data);
//   });

//   client.end();
// // });

// var WebSocketServer = require('websocket').server;
// var http = require('http');
 
// var server = http.createServer(function(request, response) {
//     console.log((new Date()) + ' Received request for ' + request.url);
//     response.writeHead(404);
//     response.end();
// });
// server.listen(8090, function() {
//     console.log((new Date()) + ' Server is listening on port 8090');
// });
 
// wsServer = new WebSocketServer({
//     httpServer: server,
//     // You should not use autoAcceptConnections for production
//     // applications, as it defeats all standard cross-origin protection
//     // facilities built into the protocol and the browser.  You should
//     // *always* verify the connection's origin and decide whether or not
//     // to accept it.
//     autoAcceptConnections: false
// });
 
// function originIsAllowed(origin) {
//   // put logic here to detect whether the specified origin is allowed.
//   return true;
// }
 
// wsServer.on('request', function(request) {
//     if (!originIsAllowed(request.origin)) {
//       // Make sure we only accept requests from an allowed origin
//       request.reject();
//       console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//       return;
//     }
    
//     var connection = request.accept(request.origin);
//     console.log((new Date()) + ' Connection accepted.');
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             console.log('Received Message: ' + message.utf8Data);
//             connection.sendUTF(message.utf8Data);
//         }
//         else if (message.type === 'binary') {
//             console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//             connection.sendBytes(message.binaryData);
//         }
//     });
//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });
// });


// var WebSocketClient = require('websocket').client;
 
// var client = new WebSocketClient();
 
// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });
 
// client.on('connect', function(connection) {
//     console.log('WebSocket Client Connected');
//     connection.on('error', function(error) {
//         console.log("Connection Error: " + error.toString());
//     });
//     connection.on('close', function() {
//         console.log('echo-protocol Connection Closed');
//     });
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             console.log("Received: '" + message.utf8Data + "'");
//         }
    
//    connection.close();
//     });
//     connection.sendUTF('<message><update><speed1>335</speed1><speed2>999</speed2> <temperature>999</temperature></update></message>');
     
// });
 
// client.connect('ws://localhost:8080/');

// const socket = new WebSocket('ws://localhost:8080');

//         // Connection opened
//         socket.addEventListener('open', (event) => {
//            // socket.send('<message><update><speed1>123</speed1><speed2>222</speed2> <temperature>12</temperature></update></message>');
//         });
        
//         // Listen for messages
//         socket.addEventListener('message', (event) => {
//             // tslint:disable-next-line:no-console
//             console.log('Subscription response ', event.data);
//             socket.close();
//         });

const WebSocket = require('ws');
 
const ws = new WebSocket('ws://127.0.0.1:8080/'); 

ws.on('open', function open() {
	
	ws.send(JSON.stringify({ 
	"type": "command",
	"command": "connect",
	}));
  console.log('Connection opened');
  // ws.send(JSON.stringify({ 
  // "desiredTemperature": "23",
  // "engine1Direction": "1",
  // "engine1Speed": "30",
  // "engine2Direction": "0",
  // "engine2Speed": "20",
// }));

});
 
// ws.on('message', function incoming(data) {
  // console.log(data);
  // ws.send(data);
// });
 