
const socketTypes = { BROWSER: 'browser', HARDWARE: 'hardware', UNKNOWN: 'unknown'};  
const messageTypes = { UPDATE: 'update', STATUS: 'status', COMMAND: 'command', REEL: 'reel', 'AUTOPROGRAM': 'autoProgram', ELONGATION: 'elongation' }; 

const browserNames = ['Mozilla', 'Chrome', 'Edge'];
const hardwareControllerName = 'wds-hardware-controller'; 

const socketTypesSubscriptions =  {
    browser: [ messageTypes.UPDATE, messageTypes.STATUS, messageTypes.REEL, messageTypes.AUTOPROGRAM, messageTypes.ELONGATION],
    hardware: [ messageTypes.UPDATE, messageTypes.COMMAND],
    unknown: []
} 

function getSocketType(userAgentHeader) {
    if (!userAgentHeader) {
        return socketTypes.UNKNOWN;
    } 

    if (userAgentHeader.includes(hardwareControllerName)) {
        return socketTypes.HARDWARE;
    }

    for (let i = 0; i < browserNames.length; i++) {
        if (userAgentHeader.includes(browserNames[i])) {
            return socketTypes.BROWSER;
        }
    }

    return socketTypes.UNKNOWN;
}

function isSocketTypeSubscribedToMessage(message, socketType) {  
    if (!message.type) {
        return false;
    } 
    
    switch (socketType) {
        case socketTypes.BROWSER:
            return socketTypesSubscriptions.browser.includes(message.type);
        case socketTypes.HARDWARE: 
            return socketTypesSubscriptions.hardware.includes(message.type);
        default:
            return false; 
    }
}


module.exports = {
    socketTypes,
    messageTypes,
    getSocketType,
    isSocketTypeSubscribedToMessage
}