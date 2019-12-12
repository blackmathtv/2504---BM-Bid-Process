function hideNum(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[2];

    // Hides the first three columns
    sheet.hideColumns(4);
    sheet.hideColumns(5);
    sheet.hideColumns(7);
    sheet.hideColumns(8);
    return 0;
}

function showNum(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[2];

    // Hides the first three columns
    sheet.showColumns(4);
    sheet.showColumns(5);
    sheet.showColumns(7);
    sheet.showColumns(8);
    return 0;
}