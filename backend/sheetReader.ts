function parseJSON(){
    var sheetReader = new SheetReader();
    var data = sheetReader.data;
    return data
}

class SheetReader{

   public data = {
        sections: {

        },

        overview:{

        },

        dates:{

        },

        info:{
            cost: 0,
            total: 0,
            creativeMarkup: 0,
            fees: {
            }
        }
    };

    activeSpreadsheet;

    constructor(){
        this.activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        this.data = this.fetchData();
    }

    fetchData(){
        this.parseInfo();
        this.parseOverview();
        this.parseServices();

        this.data.info.total = this.data.info.cost;
        
        for(var fee in this.data.info.fees){
            this.data.info.total += parseInt(this.data.info.fees[fee]);
        }
        this.data.info.total *= (1 + this.data.info.creativeMarkup);

        return this.data;
    }

    private parseInfo(){

        var sheet = this.activeSpreadsheet.getSheets()[0];
        var range = sheet.getDataRange();
        var values = range.getValues();

        var currentSection = '';

        for(var row in values){
            if(values[row][0] == 'DOCUMENT INFO'){
                currentSection = 'info'
            }
            else if(values[row][0] == 'MASTER COSTS'){
                currentSection = 'fees';
            }
            else {

                if(currentSection == 'fees'){
                    this.data.info[values[row][0]] = values[row][1];
                    if(values[row][0] == 'Creative Markup'){
                        this.data.info.creativeMarkup = values[row][1];
                    }
                    else{
                        this.data.info.fees[values[row][0]] = values[row][1];
                    }
                }
                else if(currentSection == 'info'){
                    this.data.info[values[row][0]] = values[row][1];
                }
            }
        }
    }

    private parseOverview(){
        var sheet = this.activeSpreadsheet.getSheets()[1];
        var range = sheet.getDataRange();
        var values = range.getValues();

        var currentSection = '';
        for(var row in values){
            var firstValue = values[row][0];
            var secondValue = values[row][1];

            if(secondValue == '' && firstValue == firstValue.toUpperCase() && firstValue != ''){
                currentSection = firstValue;
            }
            else{
                if(currentSection == 'PROJECT OVERVIEW'){
                    this.data.info[firstValue] = secondValue;
                }
                else if(currentSection == 'KEY DATES'){
                    this.data.dates[firstValue] = secondValue;
                }
                else if(currentSection == 'OTHER'){
                    this.data.overview[firstValue] = secondValue;
                }
            }
        }
    }

    private countNotEmpty(array){
        var count = 0;
        for(var x in array){
            if(array[x] != '') count++
        }
        return count;
    }

    private parseServices(){
       
        var sheet = this.activeSpreadsheet.getSheets()[2];
        var range = sheet.getDataRange();
        var values = range.getValues();

        var currentSection = '';

        for(var row in values){
            var currentRow = values[row];
            var firstValue = currentRow[0];

            //if a title
            if(this.countNotEmpty(currentRow) == 1){
                if(firstValue == firstValue.toUpperCase()){
                    currentSection = firstValue;

                    //add new section
                    this.data.sections[currentSection] = {
                        services: [],
                        subtotal: 0
                    };
                }
            }
            //if a body row
            else if(currentRow[0] != "Name"){

                if(currentRow[7] > 0){
                    this.data.sections[currentSection].services.push({
                        name: currentRow[0],
                        service: currentRow[1],
                        quantity: currentRow[2],
                        padding: currentRow[3],
                        units: currentRow[5],
                        rate: currentRow[6],
                        total: currentRow[7]
                    });

                    this.data.sections[currentSection].subtotal += currentRow[7];
                }
            }
        }

        for(var section in this.data.sections){
            this.data.info.cost += this.data.sections[section].subtotal;
            if(Object.keys(this.data.sections[section].services).length == 0){
                delete this.data.sections[section];
            }
        }
    }
}