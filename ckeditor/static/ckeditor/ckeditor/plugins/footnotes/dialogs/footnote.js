CKEDITOR.dialog.add("footnoteDialog", function (editor) {
    return {
        title: "Add Footnote",
        width: 400,
        height: 350,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [
            {
                id: "main_tab",
                label: "Main",
                elements: [
                    {
                        type: "text",
                        id: "number",
                        label: "Number",
                        validate: CKEDITOR.dialog.validate.integer("Footnote number must be an integer."),
                        onShow: function () {
                            this.setValue(this.getDialog().number);
                        }
                    },
                    {
                        type: "textarea",
                        id: "text",
                        label: "Footnote text",
                        rows: 8,
                        validate: CKEDITOR.dialog.validate.notEmpty("Footnote text field cannot be empty.")
                    },
                    {
                        type: "hbox",
                        widths: ["90%", "10%"],
                        children: [
                            {
                                type: "text",
                                id: "search_field",
                                label: "Search by publication title"
                            },
                            {
                                type: "button",
                                id: "search_button",
                                label: "Search",
                                style: "float: right; margin-top: 14px;",
                                onClick: function () {
                                    var dialog = this.getDialog(),
                                        title = dialog.getValueOf("main_tab", "search_field"),
                                        select = dialog.getContentElement("main_tab", "reference");

                                    $.ajax({
                                        type: "GET",
                                        url: "/publications/publication/api/search/",
                                        data: {
                                            title: title
                                        }
                                    }).success(function (data) {
                                        select.clear();

                                        data.forEach(function (item) {
                                          select.add(item.title, item.pk);
                                        });

                                        if (!select.isEnabled()) {
                                          select.enable();
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    {
                        type: "select",
                        id: "reference",
                        label: "Reference",
                        items: [],
                        multiple: true,
                        style: "width: 400px; height: 102px;",
                        onShow: function () {
                            this.disable();
                        },
                        onHide: function () {
                            this.clear();
                        }
                    }
                ]
            }
        ],
        onShow: function () {
            this.number = this.number ? this.number + 1 : 1;
        },
        onOk: function () {
            var dialog = this,
                number = this.number = parseInt(dialog.getValueOf("main_tab", "number")),
                text = dialog.getValueOf("main_tab", "text"),
                reference = $(dialog.getContentElement("main_tab", "reference").getInputElement().$).val(),
                footnote_data = {
                    number: number,
                    text: text
                },

                get_cookie = function(name) {
                    var match = document.cookie.match(new RegExp(name + "=([^;]+)"));
                    if (match) return match[1];
                },

                get_publication_id = function () {
                    publication_id = location.pathname.match(/publication\/(\d+)/);
                    publication_id = publication_id ? publication_id[1] : $('input[name="publication"]').val();

                    return parseInt(publication_id);
                },

                render_footnote = function () {
                    var footnote = editor.document.createElement("a");

                    footnote.addClass("footnotes__ref");
                    footnote.setAttribute("href", "#footnote_" + number);
                    footnote.setText(number);

                    editor.insertElement(footnote);
                };

            footnote_data["reference"] = reference ? reference.map(Number) : [];
            footnote_data["publication"] = get_publication_id();

            $.ajax({
                type: "POST",
                url: "/publications/publication/api/create_footnote/",
                headers: {
                    "X-CSRFToken": get_cookie("csrftoken")
                },
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(footnote_data)
            })
            .success(render_footnote)
            .error(function (xhr) {
                var errors = xhr.responseJSON && xhr.responseJSON.non_field_errors;

                if (errors) {
                    var errors_msg;

                    if (errors.length > 1) {
                        errors_msg = errors.reduce(function (prev, curr, i) {
                            i++;
                            return prev += i + ". " + curr + (i == errors.length ? "" : "\n");
                        }, "Errors:\n");
                    } else {
                        errors_msg = "Error: " + errors[0];
                    }

                    alert(errors_msg);
                }
            });
        },
        onCancel: function () {
            if (this.number > 0) {
                --this.number;
            }
        }
    };
});
