import '@k2oss/k2-broker-core';

metadata = {
    systemName: "TaskManagerCSVReader",
    displayName: "Task Manager CSV Reader Broker",
    description: "A broker that reads a CSV file and returns the info for use in the Task Manager Application.",
    configuration: {
        "FirstRowIsHeader": {
            displayName: "First Row Is Header",
            type: "boolean",
            value: true
        },
        "LineSplitChar": {
            displayName: "Line Split Character",
            type: "string",
            value: "newline"
        },
        "FieldSplitChar": {
            displayName: "Field Split Character",
            type: "string",
            value: ";"
        }
    }
};

//INTERNAL REFERENCE;CATEGORY;PRIORITY;ASSIGNED TO;SUBJECT;DESCRIPTION;TASK DUE DATE
ondescribe = async function ({ configuration }): Promise<void> {
    postSchema({
        objects: {
            "tasks": {
                displayName: "Tasks",
                description: "Describes all tasks in a CSV file",
                properties: {
                    "fileContent": {
                        displayName: "File Content",
                        type: "string"
                    },
                    "id": {
                        displayName: "ID",
                        type: "number"
                    },
                    "reference": {
                        displayName: "Internal Reference",
                        type: "string"
                    },
                    "category": {
                        displayName: "Category",
                        type: "string"
                    },
                    "priority": {
                        displayName: "Priority",
                        type: "string"
                    },
                    "assignedTo": {
                        displayName: "Assigned To",
                        type: "string"
                    },
                    "subject": {
                        displayName: "Subject",
                        type: "string"
                    },
                    "description": {
                        displayName: "Description",
                        type: "string"
                    },
                    "dueDate": {
                        displayName: "Task Due Date",
                        type: "dateTime"
                    }
                },
                methods: {
                    "getTasks": {
                        displayName: "Get Tasks",
                        type: "list",
                        inputs: ["fileContent"],
                        outputs: ["id", "reference", "category", "priority", "assignedTo", "subject", "description", "dueDate"]
                    },
                    "getTask": {
                        displayName: "Get Task",
                        type: "read",
                        inputs: ["fileContent", "id"],
                        outputs: ["id", "reference", "category", "priority", "assignedTo", "subject", "description", "dueDate"]
                    }
                }
            }
        }
    });
}

onexecute = async function ({ objectName, methodName, parameters, properties, configuration, schema }): Promise<void> {
    switch (objectName) {
        case "tasks": await onexecuteSplit(methodName, properties, configuration); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteSplit(methodName: string, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    switch (methodName) {
        case "getTasks": await onexecuteGetTasks(properties, configuration); break;
        case "getTask": await onexecuteGetTask(properties, configuration); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetTasks(properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            const str = Base64.decode(getBase64FromContent(properties["fileContent"].toString()));
            var lines = [];

            if (configuration["LineSplitChar"].toString() == "newline") {
                lines = str.split(/\r?\n/);
            }
            else {
                lines = str.split(configuration["LineSplitChar"].toString());
            }

            var lineObj = [];

            var startIndex = configuration["FirstRowIsHeader"] ? 1 : 0;

            for (let index = startIndex; index < lines.length; index++) {
                var line = lines[index].split(configuration["FieldSplitChar"].toString());

                lineObj.push({
                    id: index,
                    reference: line[0],
                    category: line[1],
                    priority: line[2],
                    assignedTo: line[3],
                    subject: line[4],
                    description: line[5],
                    dueDate: line[6]
                });
            }

            postResult(lineObj.map(x => {
                return {
                    "id": x.id,
                    "reference": x.reference,
                    "category": x.category,
                    "priority": x.priority,
                    "assignedTo": x.assignedTo,
                    "subject": x.subject,
                    "description": x.description,
                    "dueDate": Date.parse(x.dueDate)
                }
            }));

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

function onexecuteGetTask(properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            const str = Base64.decode(getBase64FromContent(properties["fileContent"].toString()));
            var lines = [];

            if (configuration["LineSplitChar"].toString() == "newline") {
                lines = str.split(/\r?\n/);
            }
            else {
                lines = str.split(configuration["LineSplitChar"].toString());
            }

            var id = parseInt(properties["id"].toString());
            var line = lines[id].split(configuration["FieldSplitChar"].toString());

            var lineObj = {
                id: id,
                reference: line[0],
                category: line[1],
                priority: line[2],
                assignedTo: line[3],
                subject: line[4],
                description: line[5],
                dueDate: line[6]
            };

            postResult({
                    "reference": lineObj.reference,
                    "category": lineObj.category,
                    "priority": lineObj.priority,
                    "assignedTo": lineObj.assignedTo,
                    "subject": lineObj.subject,
                    "description": lineObj.description,
                    "dueDate": Date.parse(lineObj.dueDate)
                }
            );

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

function getBase64FromContent(content: string) {
    var base64 = "";

    var split1 = content.split("<content>")[1];
    base64 = split1.split("</content>")[0];

    return base64;
}

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = 0, c1 = 0, c2 = 0, c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}