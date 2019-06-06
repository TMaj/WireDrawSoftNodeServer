
function initializeState() {
    const currentState = {
        "type" : "update",
        "currentTemperature": "23",
        "desiredTemperature": "23",
        "engine1Direction": "1",
        "engine1Speed": "0",
        "engine2Direction": "0",
        "engine2Speed": "0",
      };
      
    const status = {
        "type" : "status",
        "connectedToEngines" : false,
        "connectedToHardwareController" : false
      };
       
    const elongation = {
        "type" : "elongation",
        "leftLength" : "0",
        "rightLength": "0",
        "reelDiameter" : "0.1"
      };

    return {
        currentState,
        status,
        elongation
    };
} 

const updateProperties = ['currentTemperature', 'desiredTemperature', 
'engine1Direction', 'engine1Speed', 'engine2Direction', 'engine2Speed'];

const statusProperties = ['connectedToEngines', 'connectedToHardwareController'];
const elongationProperties = ['leftLength', 'rightLength', 'reelDiameter']; 

// Updates state and returns updated state sub-object or received object if nothing was updated
function updateState(state, obj) { 
    if (obj.type === 'update') {
         updateProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.currentState[property] = obj[property].toString();
            }
         }); 
      return state.currentState;      
    }

    if (obj.type === 'status') {
        statusProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.status[property] = obj[property].toString();
            }
        });
      return state.status;       
    }

    if (obj.type === 'elongation') {
          elongationProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.elongation[property] = obj[property].toString();
            }
      });  
      return state.elongation;     
    } 
    
    return obj;
}

module.exports = {
  initializeState,
  updateState
};