const currentElongationState = {
    leftLength: 0,
    rightLength: 0,
} 

let engine1Speed = 0;
let engine2Speed = 0;

let reelDiameter = 0.1;  
var intervalId;
let intervalSet = false;

let processOn = false;

function calculateAndSendLengthUpdate() {

    const extraLeft = engine1Speed * reelDiameter * Math.PI * 0.05;
    const extraRight = engine2Speed * reelDiameter *  Math.PI * 0.05;

    currentElongationState.leftLength = currentElongationState.leftLength + extraLeft;
    currentElongationState.rightLength = currentElongationState.rightLength + extraRight; 

    process.send ({
        "type" : "elongation",
        "leftLength" : currentElongationState.leftLength,
        "rightLength": currentElongationState.rightLength,
    });
}

function handleUpdate(update) { 
    console.log('Elongation service: handling update');
    engine1Speed = update.engine1Speed;
    engine2Speed = update.engine2Speed;


    if (update.engine1Speed != 0 && update.engine2Speed != 0) {
        processOn = true;
    }
    
    if (processOn && !intervalSet) { 
        intervalSet = true;
        currentElongationState.leftLength = 0;
        currentElongationState.rightLength = 0; 
        console.log('Setting interval');
        intervalId = setInterval(calculateAndSendLengthUpdate, 2995);
        console.log(intervalId);
    } 

    if (update.engine1Speed == 0 && update.engine2Speed == 0) {
        console.log('Elongation service: speeds are 0, stoppin');
        processOn = false;
        clearInterval(intervalId);
        intervalSet = false;
    } 
}

function handleReelUpdate(update) {
    reelDiameter = update.diameter;
} 

process.on('message', message => {  

    switch (message.type) {
        case 'update': 
        handleUpdate(message);
        break;

        case 'reel':
        handleReelUpdate(message);
        break; 
    } 
});