
let steps = []; 
let currentStepNo = 0; 

let autoProgramCancel = false; 

let timeoutId;
 
function executeAutoProgram() {
    playAutoProgramStep();
}

function playAutoProgramStep() { 
    if (currentStepNo >= steps.length) {
       
        process.send({
            type: "update",
            engine1Speed: 0, 
            engine2Speed: 0, 
            desiredTemperature: 0,
        });

        process.send({
            type : "status",
            autoProgram: false  
        });
        
        return;
    }

    console.log(`AutoProgram service :: Step no ${currentStepNo}`);
    const update = {
        type : "update",
        ...steps[currentStepNo]
    };

    console.log(update);

    process.send(update);
    
    currentStepNo++;
    timeoutId = setTimeout(playAutoProgramStep, steps[currentStepNo - 1].time * 1000)
}

function cancelAutoProgramExecution() { 
    clearTimeout(timeoutId);
    currentStepNo = 0;
}

function handleAutoProgramChange(autoProgram) {
    console.log('AutoProgram service :: received new steps');  
    cancelAutoProgramExecution();
    steps = autoProgram.steps;    
}  

function handleStatusChange(status) {
    console.log('AutoProgram service :: received status');  
     
    if (status.autoProgram) { 
        console.log('AutoProgram service :: starting !'); 
    
        cancelAutoProgramExecution();
        executeAutoProgram();
        return;
    }

    if (!status.autoProgram) {
        console.log('AutoProgram service :: cancelling !');
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