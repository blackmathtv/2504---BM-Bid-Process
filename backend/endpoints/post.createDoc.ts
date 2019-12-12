function createDoc(){
    var doc = new this.DocumentCreator(this.DocTemplateID, this.parseJSON());
    doc.createDoc();
}