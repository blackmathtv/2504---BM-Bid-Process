# Resources: 
[#Installing and using clasp](https://github.com/google/clasp/blob/master/docs/typescript.md)

[Google Apps scripting Documentation](https://developers.google.com/apps-script/reference/)

[Google Apps scripting Getting Started Guide](https://developers.google.com/apps-script/overview)

[Harvest API reference](https://help.getharvest.com/api-v2/)

[Material UI CSS framework](https://www.muicss.com/)

# Setup and Building:
* [Download and install Visual Studio Code.](https://code.visualstudio.com/download)

* [install and set up clasp](https://github.com/google/clasp).
  
 * clone this project
 
 * open in VS code
 
 * create a file called `environment.ts`
 
 * inside it, paste 
 ```
 let JobTypesSpreadsheetID = 'The ID of the Job Types spreadsheet goes here!';

let DocTemplateID = 'The ID of the Template document goes here';

let HarvestAuthHeaders = {
  'Harvest-Account-ID': 123456,
  'Authorization': 'Bearer ' + 'your harvest authorization token goes here',
  'User-Agent' : 'harvest User Agent Goes Here'
};
 ```
 * Fill in the blanks with the appropriate values. This file is ignored by the .gitignore but make sure you don't push it to git. Pushing API keys to github is very bad.
 
 * Command + Shift + B should build the project and push it to the google script editor
 
 # Other
 
 [program flow chart](https://www.lucidchart.com/documents/view/289f1fed-7bbf-4160-ad6a-27548cbad430/0_0)
