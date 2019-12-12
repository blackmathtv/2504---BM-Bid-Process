function getChips(){
    var jobTypes = JSON.parse(PropertiesService.getScriptProperties().getProperty('jobTypes'));
    var inData = jobTypes;
    var types = {};
    
    for(var type in inData){
        types[type] = inData[type].selected;
    }

    return(types);
  }