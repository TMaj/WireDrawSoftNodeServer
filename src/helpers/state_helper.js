
function initializeState() {
    const currentState = {
        "type" : "update",
        "currentTemperature": 0,
        "desiredTemperature": 0,
        "engine1Direction": 1,
        "engine1Speed": 0,
        "engine2Direction": 1,
        "engine2Speed": 0,
      };
      
    const status = {
        "type" : "status",
        "autoProgram": false,
        "connectedToEngines" : false,
        "connectedToHardwareController" : false
      };
       
    const elongation = {
        "type" : "elongation",
        "leftLength" : 0,
        "rightLength": 0,
      };

    const reel = {
        "type" : "reel",
        "diameter" : 0.1
      };

    const autoProgram = {        
        "type" : "autoProgram",
        "steps" : [], 
      };

    return {
        currentState,
        status,
        elongation,
        reel,
        autoProgram
    };
} 

const updateProperties = ['currentTemperature', 'desiredTemperature', 
'engine1Direction', 'engine1Speed', 'engine2Direction', 'engine2Speed'];

const statusProperties = ['connectedToEngines', 'connectedToHardwareController', 'autoProgram'];
const elongationProperties = ['leftLength', 'rightLength']; 
const reelProperties = ['diameter'];
const autoProgramProperties = ['steps'];

// Updates state and returns updated state sub-object or received object if nothing was updated
function updateState(state, obj) { 
    if (obj.type === 'update') {
         updateProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.currentState[property] = obj[property]; //.toString();
            }
         }); 
      return state.currentState;
    }

    if (obj.type === 'status') {
        statusProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.status[property] = obj[property];
            }
        });
      return state.status;
    }

    if (obj.type === 'elongation') {
          elongationProperties.forEach(property => {
            if (obj[property] !== undefined) { 
              state.elongation[property] = obj[property];
            }
      });  
      return state.elongation;
    }
    
    if (obj.type === 'reel') {
      reelProperties.forEach(property => {
        if (obj[property] !== undefined) { 
          state.reel[property] = obj[property];
        }
      });  
      return state.reel;
    } 
        
    if (obj.type === 'autoProgram') {
      autoProgramProperties.forEach(property => {
        if (obj[property] !== undefined) { 
          state.autoProgram[property] = obj[property];
        }
      });  
      return state.autoProgram;
    } 
    
    return obj;
}

module.exports = {
  initializeState,
  updateState
};