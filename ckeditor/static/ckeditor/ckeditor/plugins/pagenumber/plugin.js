CKEDITOR.plugins.add("pagenumber", {
    icons: "pagenumber",
    hidpi: true,
    init: function(editor) {
        CKEDITOR.dialog.add("pagenumberDialog", this.path + "dialogs/pagenumber.js");

        editor.addContentsCss(this.path + "styles/pagenumber.css");

        editor.addCommand("insertPagenumber", new CKEDITOR.dialogCommand("pagenumberDialog"));

        editor.ui.addButton("Pagenumber", {
            label: "Insert page number",
            command: "insertPagenumber",
            toolbar: "insert"
        });
    }
});
