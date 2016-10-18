CKEDITOR.dialog.add("pagenumberDialog", function (editor) {
    return {
        title: "Add Page Number",
        width: 300,
        height: 100,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [
            {
                id: "main_tab",
                label: "Main",
                elements: [
                    {
                        type: "text",
                        id: "number",
                        label: "Page number",
                        validate: CKEDITOR.dialog.validate.integer("Page number must be an integer."),
                        onShow: function () {
                            this.setValue(1);
                        }
                    }
                ]
            }
        ],
        onOk: function () {
            var dialog = this,
                number = this.number = parseInt(dialog.getValueOf("main_tab", "number")),
                pagenumber_data = {
                    number: number
                };

						var DOMnumber = editor.document.createElement("u");
						var DOMicon = editor.document.createElement("span");
						var DOMspan = editor.document.createElement("span");

						DOMicon.addClass('pagenumber__icon');
						DOMnumber.setText(number);
						DOMspan.addClass('pagenumber');
						DOMspan.setText('Page ');
						DOMspan.append(DOMicon);
						DOMspan.append(DOMnumber);

						editor.insertElement(editor.document.createElement('br'));

						editor.insertElement(DOMspan);

						editor.insertElement(editor.document.createElement('hr'));
        }
    };
});
