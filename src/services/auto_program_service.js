
let steps = []; 
let currentStepNo = 0; 

let autoProgramCancel = false; 

let timeoutId;
 
function executeAutoProgram() {
    playAutoProgramStep();
}

function playAutoProgramStep() { 
    process.send({
        "type" : "update",
        ...steps[currentStepNo]
    });

    currentStepNo++;

    if (currentStepNo >= steps.length) {
        process.send({
            type: "update",
            engine1Speed: 0, 
            engine2Speed: 0, 
            desiredTemperature: 0
        });

        process.send({
            type : "status",
            autoProgram: false  
        });
        
        return;
    }
    
    timeoutId = setTimeout(playAutoProgramStep, steps[currentStepNo].time * 1000)
}

function cancelAutoProgramExecution() { 
    clearTimeout(timeoutId);
    currentStepNo = 0;
}

function handleAutoProgramChange(autoProgram) {
    cancelAutoProgramExecution();
    steps = autoProgram.steps;    
}  

function handleStatusChange(status) {
    console.log('AutoProgram: received status');
    console.log(status); 

     
    if (status.autoProgram) { 
        console.log('AutoProgram: starting !'); 
    
        cancelAutoProgramExecution();
        executeAutoProgram();
        return;
    }

    if (!status.autoProgram) {
        console.log('AutoProgram: cancelling !');
        cancelAutoProgramExecution();
        return;
    } 
}

process.on('message', message => {  

    switch (message.type) {
        case 'autoProgram': 
        handleAutoProgramChange(message);
        break; 
        case 'status': 
        handleStatusChange(message);
        break; 
    }  
});