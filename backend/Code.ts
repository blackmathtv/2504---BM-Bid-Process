function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Custom Menu')
    .addItem('Open Sidebar', 'showSidebar')
    .addToUi();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet(request) {
  return HtmlService.createTemplateFromFile('frontend/Page').evaluate();
}

function showSidebar() {
  var html = this.doGet();
  html.setTitle('Subtotals').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}