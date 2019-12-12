function rollupData(bidData, harvestData){

    console.log('rolling up data');

    var parsedServices = {
        total : {
            allocatedHours: 0,
            usedHours: 0
        },
        services : {
            
        },
        hardCosts : {
            progress : 0,
            estimated : 0,
            lineItems : []
        }
    }

    if(harvestData.total) parsedServices.total.usedHours = harvestData.total;

    //parse data from table
    for(var section in bidData){
        for( var row in bidData[section].services){
            //if service doesn't exist yet, initalize it

            var serviceTitle = bidData[section].services[row].service;

            //if service is a hard cost
            if(serviceTitle == "HARD COST"){
                var cost = parseInt(bidData[section].services[row].quantity) * parseInt(bidData[section].services[row].rate);
                parsedServices.hardCosts.estimated += cost;
                parsedServices.hardCosts.lineItems.push([{title: bidData[section].services[row].name, quantity: cost}]);
            }

            //if service is anything but a hard cost
            else {
                 //initalize each service row
                if(!parsedServices.services[serviceTitle]){
                    parsedServices.services[serviceTitle] = {
                        services: [],
                        budgetDollars: 0,
                        spentDollars: 0,
                        remainingDollars: 0,
                        spentHours: 0,
                        estimatedHours: 0,
                        percent: 0
                    }

                    //set spent hours
                    if(harvestData[serviceTitle]) parsedServices.services[serviceTitle].spentHours = harvestData[serviceTitle];
                }

                //if the quantity cell isn't null or otherwise malformed, add it to the running total and current cell
                var quantity = parseInt(bidData[section].services[row].quantity);
                var rate = parseInt(bidData[section].services[row].rate);

                if(quantity && rate){
                    parsedServices.services[serviceTitle].estimatedHours += quantity;
                    parsedServices.services[serviceTitle].budgetDollars += (rate * quantity);


                    //total estimated hours
                    parsedServices.total['estimatedHours'] += quantity;

                    //sub services
                    parsedServices.services[serviceTitle].services.push([{title: bidData[section].services[row].name, quantity: quantity}]);
                }
            }
        }
    }

    for(var service in parsedServices.services){
        parsedServices.services[service].percent = ( 100 / parsedServices.services[service].estimatedHours ) * parsedServices.services[service].spentHours;
        parsedServices.services[service].spentDollars = (parsedServices.services[service].percent/100) * parsedServices.services[service].budgetDollars;
        parsedServices.services[service].remainingDollars = parsedServices.services[service].budgetDollars - parsedServices.services[service].spentDollars;
    }
    return parsedServices;
}

function renderRollup(rollupData){
    
    console.log('rendering rollup');
    console.log(JSON.stringify(rollupData));
    var offset = 16;

    var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheets()[4];

    //initalize header
    sheet.getRange('A'+offset+':H'+offset)
    .setBackground('#000000')
    .setFontColor('#ffffff')
    .setValues([['% Used', 'Rollup // Hourly', 'Budget ($)', 'Spent ($)' ,'Remaining ($)', '[Estimated Hours]', '[Spent Hours]', 'Notes']])
    .setFontWeight("bold");

    offset+= 1;

    var values = [];
    for(var serviceName in rollupData.services){
        var row = rollupData.services[serviceName];
        values.push([row.percent+ '%', serviceName, '$'+row.budgetDollars, '$'+row.spentDollars, '$'+row.remainingDollars, row.estimatedHours, row.spentHours,'']);
    }

    sheet.getRange('A'+offset+':H' + (values.length-1 + offset))
    // .setBackground('#ff0000')
    .setFontColor ('#000000')
    .setValues(values);

    offset += 2+values.length-1;

    //initalize header
    sheet.getRange('A'+offset+':H'+offset)
    .setBackground('#000000')
    .setFontColor('#ffffff')
    .setValues([['% Used', 'Rollup // Hourly', 'Budget ($)', 'Spent ($)' ,'Remaining ($)', '[Estimated Hours]', '[Spent Hours]', 'Notes']])
    .setFontWeight("bold");

    offset += 1;

    var parsedHardCosts = [];
    for(var hardCost in rollupData.hardCosts.lineItems){
        var currentCost = rollupData.hardCosts.lineItems[hardCost][0];
        // console.log(currentCost);
        parsedHardCosts.push([currentCost.title, currentCost.quantity]);
    }

    sheet.getRange('C'+offset+':D' + (parsedHardCosts.length-1 + offset))
    // .setBackground('#ff0000')
    .setFontColor ('#000000')
    .setValues(parsedHardCosts);

}