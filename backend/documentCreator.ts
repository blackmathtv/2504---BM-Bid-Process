class DocumentCreator {

    templateID: string;
    data: JSON;
    doc;

    constructor(templateDoumentid: string, pData: any) {
        this.templateID = templateDoumentid;
        this.data = pData;
        console.log(pData);
    }

    public createDoc(){
        var docid = DriveApp.getFileById(this.templateID).makeCopy(this.getParentFolder()).getId();
        this.doc = DocumentApp.openById(docid);
        this.doc.setName("EXPORT_" + Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy"));  
        
        this.setInfo();
        this.setOverview();
        this.setKeyDates();

        this.doc.getBody().appendPageBreak();

        this.setServices();
        this.setTotal();
        this.setTail();
    }
    
    private getParentFolder(){
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var file = DriveApp.getFileById(ss.getId());
        var folders = file.getParents();
        while (folders.hasNext()){
            return folders.next();
        }
    }

    //set all the data in the header to the coorosponding data in the info page

    //set all the static data in the body to the coorosponding data in the info page
    private setInfo(){
        // console.log(this.doc);
        console.log('setting info');
        // console.log(this.data['info']);

        var header = this.doc.getHeader();
        var body = this.doc.getBody();

        for (var name in this.data['info']) {
            // console.log(name);
            header.replaceText("{" + name + "}", this.data['info'][name]);
            body.replaceText("{" + name + "}", this.data['info'][name]);
        }
    }

    private setTotal(){
        var body = this.doc.getBody();
        body.appendParagraph("↗TOTAL.").setHeading(DocumentApp.ParagraphHeading.HEADING1);

        var feeTable = body.appendTable().setBorderColor("#efefef");;
        var SubtotalRow = feeTable.appendTableRow();
        SubtotalRow.appendTableCell().setText("SUBTOTAL").setBackgroundColor("#efefef").setFontSize(14);
        SubtotalRow.appendTableCell().setText('$'+this.data["info"].cost).setBackgroundColor("#ffffff").setFontSize(14);

        var markupRow = feeTable.appendTableRow();
        markupRow.appendTableCell().setText("CREATIVE MARKUP").setBackgroundColor("#efefef").setFontSize(9);
        markupRow.appendTableCell().setText(this.data["info"].creativeMarkup+'%');

        for(var fee in this.data["info"].fees){
            var row = feeTable.appendTableRow();
            row.appendTableCell().setText(fee).setBackgroundColor("#efefef");
            row.appendTableCell().setText('$'+this.data["info"].fees[fee]).setBackgroundColor("#ffffff");
        }

        var totalRow = feeTable.appendTableRow();
        totalRow.appendTableCell().setText("TOTAL").setBackgroundColor("#2651fb").setForegroundColor('#ffffff').setFontSize(16);
        totalRow.appendTableCell().setText('$'+this.data["info"].total).setBackgroundColor("#2651fb").setForegroundColor('#ffffff').setFontSize(16);
    }

    private setTail(){
        var body = this.doc.getBody();
        body.appendParagraph(">BID GOOD THRU 00/00/19.")
        .setHeading(DocumentApp.ParagraphHeading.HEADING6);

        body.appendParagraph(">NOTES.")
        .setHeading(DocumentApp.ParagraphHeading.HEADING6);

        body.appendParagraph(`This is a fixed price bid. Hour-count is not linear as multiple artists work in parallel. Bid does not include posting to a 3rd party trafficking service / FTP / etc.`)
        .setHeading(DocumentApp.ParagraphHeading.NORMAL);

        body.appendParagraph(">NOTES.")
        .setHeading(DocumentApp.ParagraphHeading.HEADING6);

        body.appendParagraph(
            `This is a fixed price bid. Hour-count is not linear as multiple artists work in parallel. Bid does not include posting to a 3rd party trafficking service / FTP / etc.`)
        .setHeading(DocumentApp.ParagraphHeading.NORMAL);


        body.appendParagraph(">PAYMENT TERMS.")
        .setHeading(DocumentApp.ParagraphHeading.HEADING6);

        body.appendParagraph(
            `All estimates are pending a jointly approved calendar and signed SOW. First 50% due upon job awardt. Remaining 50% due within 30 days of completion.`)
        .setHeading(DocumentApp.ParagraphHeading.NORMAL);

        body.appendParagraph(">MAKE PAYMENTS TO BLACK MATH, INC.")
        .setHeading(DocumentApp.ParagraphHeading.HEADING6);

        body.appendParagraph(
            `Mailing address listed below.`)
        .setHeading(DocumentApp.ParagraphHeading.NORMAL);

        body.appendParagraph('✉')
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setFontSize(48)
        .setBold(true);

    }

    //dynamiclly create all job overviews
    private setOverview(){
        console.log('setting overview');
        var body = this.doc.getBody();

        for(var overviewName in this.data["overview"]){
            var par1 = body.appendParagraph(">"+overviewName+".");
            par1.setHeading(DocumentApp.ParagraphHeading.HEADING6);

            var par2 = body.appendParagraph(this.data["overview"][overviewName]);
            par2.setHeading(DocumentApp.ParagraphHeading.NORMAL);
        }
    }

    //dynamically create all key-dates
    private setKeyDates(){
        console.log('setting key date');
        var body = this.doc.getBody();
        body.appendParagraph("↘ Key Dates.").setHeading(DocumentApp.ParagraphHeading.HEADING4);
        for(var dateName in this.data['dates']){
            body.appendParagraph("  • "+dateName+": "+this.data['dates'][dateName]);
        }
        
    }

    //dynamically create all serviceSections
    private setServices(){
        console.log('setting services');
        var body = this.doc.getBody();
        for(var sectionName in this.data['sections']){

            body.appendParagraph(sectionName).setHeading(DocumentApp.ParagraphHeading.HEADING5);
            var table = body.appendTable().setBorderColor("#efefef");

            // table.appendTableRow();

            var tableMarkupRow = table.appendTableRow();

            var firstCol = tableMarkupRow.appendTableCell().setWidth(100).setText("SERVICE");

            firstCol.setBackgroundColor("#efefef");
            tableMarkupRow.appendTableCell().setText("QTY").setBackgroundColor("#efefef");
            tableMarkupRow.appendTableCell().setText("UNITS").setBackgroundColor("#efefef");
            tableMarkupRow.appendTableCell().setText("SUBTOTAL").setBackgroundColor("#efefef");
            // firstCol

            for(var serviceName in this.data['sections'][sectionName].services){

                var currentService = this.data['sections'][sectionName].services[serviceName];
                console.log(currentService);
                var row = table.appendTableRow();

                row.appendTableCell().setText(currentService.name);
                row.appendTableCell().setText(currentService.quantity)
                .getChild(0)
                .asParagraph()
                .setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
                row.appendTableCell().setText(currentService.units);

                row.appendTableCell()
                .setText('$'+currentService.total)
                // .setBold(true)
                .getChild(0)
                .asParagraph()
                .setAlignment(DocumentApp.HorizontalAlignment.RIGHT)
                ;
            }
        }
    }
}
