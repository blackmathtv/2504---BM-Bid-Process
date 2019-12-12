function fetchJobTypes(){ 
    var ss = SpreadsheetApp.openById(this.JobTypesSpreadsheetID);

    var data = {};

    //get first page of the spreadsheet
    var sheet = ss.getSheets()[0];
    var range = sheet.getDataRange();
    var values = range.getValues();

    var currentType = 'null';
    var currentSection = 'null';

    for(var col=0; col < values.length; col++){
        for(var row=0; row < values[col].length; row++){
        
            if(values[row]){
                if(values[row][col]){
                    var currentValue = values[row][col];
        
                    //if starts and ends in [ ], set type
                    if(/^\[.*\]$/.test(currentValue)){
                            
                        // var trimmedSection = currentValue.substr(1,-1)[1]
                        var trimmedSection = currentValue.slice(1,-1);
                        currentType = trimmedSection;
        
                        //initalize the section
                        data[currentType] = {
                            selected: false,
                            services: {}
                        }
                    }
        
                    //if starts and ends in { }, set section
                    else if(/^\{.*/.test(currentValue)){
                        var trimmedSection = currentValue.slice(1,-1); 
                        currentSection = trimmedSection;
                    }
        
                    //if no characters around it, set service
                    else{
                        if(data[currentType].services[currentSection]) data[currentType].services[currentSection].push(currentValue);
                        else data[currentType].services[currentSection] = [currentValue];
                    }
                }
            }
        }
    }

    var oldJobTypes = JSON.parse(PropertiesService.getScriptProperties().getProperty('jobTypes'));
    for(var jobType in oldJobTypes){
        if(data[jobType]){
            data[jobType].selected = oldJobTypes[jobType].selected;
        }   
    }

    PropertiesService.getScriptProperties().setProperty('jobTypes', JSON.stringify(data));
}


function showType(name){
    console.log("showing type " + name);
    
    var jobTypes = JSON.parse(PropertiesService.getScriptProperties().getProperty('jobTypes'));
    jobTypes[name].selected = !jobTypes[name].selected ;
    // console.log(jobTypes[name]);
    PropertiesService.getScriptProperties().setProperty('jobTypes', JSON.stringify(jobTypes));
    updateRows();
    return jobTypes[name].selected;
}

function countNotEmpty(array){
    var count = 0;
    for(var x in array){
        if(array[x] != '') count++
    }
    return count;
}

function updateRows(){
    
    console.log('updating rows!');

    var jobTypes = JSON.parse(PropertiesService.getScriptProperties().getProperty('jobTypes'));

    console.log(JSON.stringify(jobTypes));

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[2];
    var range = sheet.getDataRange();
    var values = range.getValues();

    var currentSection = 'nullService';

    for(var row in values){
        var currentRow = values[row];
        var firstValue = currentRow[0];

        //if a title
        if(this.countNotEmpty(currentRow) == 1){
            if(firstValue == firstValue.toUpperCase()){
                currentSection = firstValue;
                console.log('currentSection: ' + currentSection);
            }
        }

        //if a body row
        else if(firstValue != "Name"){
            console.log('current row: ' + firstValue);
            for(var jobType in jobTypes){
                //if the jobtype is selected
                if(jobTypes[jobType].selected){

                    var currentSectionJobTypes = jobTypes[jobType].services[currentSection];
                    if(currentSectionJobTypes !== undefined){
                        //if firstValue exists 
                        if(firstValue){
                            //set background color of row
                            // if(this.jobTypeOptions.indexOf(values[i][0]) > -1){
                                // sheet.getRange(1+i,1).setBackgroundRGB(224, 102, 102);
                            // }
                        }
                    }
                }
            }
        }
    }
}