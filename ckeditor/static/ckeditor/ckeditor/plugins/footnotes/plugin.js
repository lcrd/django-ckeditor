CKEDITOR.plugins.add("footnotes", {
    icons: "footnote",
    hidpi: true,
    init: function(editor) {
        CKEDITOR.dialog.add("footnoteDialog", this.path + "dialogs/footnote.js");

        editor.addContentsCss(this.path + "styles/footnote.css");

        editor.addCommand("insertFootnote", new CKEDITOR.dialogCommand("footnoteDialog", {
            requiredContent: "a(footnotes__ref)[href]"
        }));

        editor.ui.addButton("Footnote", {
            label: "Insert footnote",
            command: "insertFootnote",
            toolbar: "insert"
        });
    }
});
