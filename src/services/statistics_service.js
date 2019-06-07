
const db = require('../data/db'); 

function getTime() {
    return Date.now() + (2*60*60*1000);
} 

function updatesDifferent (oldUpdate, newUpdate){
    if (!oldUpdate) {
        return true;
    }

    if ((oldUpdate.engine1Speed !== newUpdate.engine1Speed)
        || (oldUpdate.engine2Speed !== newUpdate.engine2Speed)
        || (oldUpdate.currentTemperature !== newUpdate.currentTemperature && Math.abs(oldUpdate.currentTemperature - newUpdate.currentTemperature) > 10)) {   
            return true;
    }  
    return false;
}

function speedsZero(update) {
    if (update.engine1Speed === 0 && update.engine2Speed === 0) {  
        return true;
    }

    return false;
}
  
let lastStatistics = null;
let sessionStarted = false;
let sessionStart = {}; 

async function handleUpdate(update) {
    try {
 
        let statistics = update; 
        statistics.time = getTime(); 
    
        if (updatesDifferent(lastStatistics, statistics)) { 
            if (lastStatistics) await db.saveStatistics(lastStatistics);
            await db.saveStatistics(statistics);
            lastStatistics = statistics; 
            console.log('Statistics service :: Statistics update saved'); 
        } else {
            console.log('Statistics service :: Updates the same, skipping saving');
        }
    
        if (speedsZero(statistics)) {
            if (sessionStarted) {
                let endedSession = {
                    start: sessionStart,
                    end: getTime(),
                }
                sessionStarted = false;
                db.saveSession(endedSession);
                console.log('Statistics service :: Ending session');
            }
        } else {
            if (!sessionStarted) {
                sessionStart = getTime();
                sessionStarted = true;
                console.log('Statistics service :: Starting session');
            }
        }
    } catch(error) { 
        console.log('Statistics service :: ',error); 
    } 
}    

process.on('message', async message => {

    switch (message.type) {
        case 'update': 
        await handleUpdate(message);
        break; 
    }
});
 
