function getHarvestStatus(){
    return getProjectId(getFullTitle());
}

function rollupHarvestProject(){
    var data = this.parseJSON();

    var projectName = data.info.jobNumber + ' - ' + data.info.project;
    var clientName = data.info.client;
    
    //try to check for project ID
    var projectID = getProjectId(projectName);

    //if project doesn't exist, create it
    if(projectID == false) {
        //try to check for client ID
        var clientID = getClientID(clientName);

        //if client doesn't exist, create it
        if(clientID == false) clientID = createClient(clientName);

        //for all other exceptions, return error message
        if(clientID == false) return "big error"

        else projectID = createProject(projectName, clientID);
    }

    // if something goes wrong with creating the project
    if(projectID == false) return "big error";

    //else, get the data
    else this.renderRollup(this.rollupData(data.sections, getHarvestData(projectID))); 
}

//return client ID, if ID doesn't exist, return false
function getClientID(name){
    var res = UrlFetchApp.fetch(
        'https://api.harvestapp.com/v2/clients',
        {
            method : 'get',
            contentType: 'application/json',
            headers : this.HarvestAuthHeaders
        }
    );

    //expand this to handle multiple pages
 
    var clients = JSON.parse(this.res).clients;
    for(var clientIndex in clients){
        var client = clients[clientIndex];
        var clientName = client.name;
        var id = client.id + '';
        if(name == clientName){
            return id;
        }
    }
    return false;
}

//create a client from it's name, return the client's ID, return false if already existing
function createClient(clientName){

    //try to create the client
    var res = UrlFetchApp.fetch(
        'https://api.harvestapp.com/v2/clients', 
        {
            method : 'post',
            contentType: 'application/json',
            headers : this.HarvestAuthHeaders,
            muteHttpExceptions: true,
            payload: JSON.stringify({name: clientName})
        }
    );

    this.res = JSON.parse(res.getContentText());

    // console.log('client id ' + res.id);
    //if the client was created successfully, return the id
    if(this.res.id) return this.res.id + '';

    //if the client already exists, or if there's some kind of error, return false
    else return false;
}

//return project ID, if ID doesn't exist, return false
function getProjectId(name){
    var res = UrlFetchApp.fetch(
        'https://api.harvestapp.com/v2/projects', 
        {
            method : 'get',
            contentType: 'application/json',
            headers : this.HarvestAuthHeaders
        }
    );
    
    this.res = JSON.parse(res.getContentText());

    for(var project in this.res.projects){
        if(this.res.projects[project].name == name) return (''+this.res.projects[project].id);
    }

    //add error handling for when the project can't be found
    return false;
}

//create a project from it's name, client, and budget, return the client's ID, return false if already existing
function createProject(projectName, clientID){
    
    //try to create the client
    var res = UrlFetchApp.fetch(
        'https://api.harvestapp.com/v2/projects', 
        {
            method : 'post',
            contentType: 'application/json',
            headers : this.HarvestAuthHeaders,
            muteHttpExceptions: true,
            payload: JSON.stringify({
                "client_id": clientID,
                "name": projectName,
                "is_billable":true,
                "bill_by":"Project",
                "budget_by":"none"
            })
        }
    );
    
    this.res = JSON.parse(res.getContentText());


      //if the client was created successfully, return the id
      if(this.res.id) return this.res.id + '';

      //if the client already exists, or if there's some kind of error, return false
      else return false;
}

function getFullTitle(){
    var infoPage = this.parseJSON().info;
    var fullname = infoPage.jobnumber + ' - ' + infoPage.project;
    // return infoPage;
    // console.log(fullname)
    return fullname;
}

function getHarvestData(projectID){
      var res = UrlFetchApp.fetch(
        'https://api.harvestapp.com/v2/time_entries?project_id=' + projectID, 
        {
            method : 'get',
            contentType: 'application/json',
            headers : this.HarvestAuthHeaders
        }
      );
      this.res = JSON.parse(res.getContentText());

      var hours = {
          total: 0
      }

      for(var time_entry in this.res.time_entries){
          var taskName = this.res.time_entries[time_entry].task.name;
          var hoursUsed = this.res.time_entries[time_entry].hours;
          if(!hours[taskName]){ hours[taskName] = 0 }
          hours[taskName] += hoursUsed;
          hours.total += hoursUsed;
      }

      return hours;
}