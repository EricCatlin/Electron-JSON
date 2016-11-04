var angular = require('angular');
var Materialize = require('materialize');
var app = angular.module('Home', []);

var LoadJson = function (call_back) {
    dialog.showOpenDialog(
        { properties: ['openFile'] }, function (filename) {
            if (!filename) return;
            var content = require(filename[0]);
            var filename = path.basename(filename[0]);
            call_back(SchematizeProperty(filename, content));
        });
}

var LoadSchema = function (call_back) {
    dialog.showOpenDialog(
        { properties: ['openFile'] }, function (filename) {
            if (!filename) return;
            call_back(require(filename[0]));
        });
}


var SaveSchema = function (content) {
    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, content, function (err) {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }
        });
    });
}

var SaveJson = function (content) {
    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }
        fs.writeFile(fileName, content, function (err) {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }
        });
    });
}
app.controller('HomeController', function ($scope, $timeout, AdminService) {

    $scope.$ = $;
    $scope.AdminService = AdminService;
    $scope.AdminService.admin = true;
    $scope.LoadJson = function () {
        LoadJson($scope.SetOpenFile);
    }
    $scope.LoadSchema = function () {
        LoadSchema($scope.SetOpenFile);
    }
    $scope.SaveSchema = function () {
        SaveSchema(JSON.stringify($scope.resource));
    }
    $scope.SaveJson = function () {
        SaveJson(JSON.stringify(DeSchematizeProperty($scope.resource.value)));
    }
    $scope.updateMaterialize = function () {
        $timeout(function () {
            Materialize.updateTextFields();
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true, // Displays dropdown below the button
                alignment: 'left' // Displays dropdown with edge aligned to the left of button
            }
            );
             $('.collapsible').collapsible();
        }, 500);
    }
    $scope.SetOpenFile = function (object) {
        $scope.resource = object;
        $scope.raw = object;
        $scope.options = { mode: 'tree' };
        $scope.updateMaterialize();
        if (!$scope.$$phase) $scope.$apply();
    }
    $scope.SetOpenFile(SchematizeProperty("test", test_obj));




    $scope.LoadJson = function () {
        LoadJson($scope.SetOpenFile);
    }
    $scope.LoadSchema = function () {
        LoadSchema($scope.SetOpenFile);
    }
    $scope.SaveSchema = function () {
        SaveSchema(JSON.stringify($scope.resource));
    }
    $scope.SaveJson = function () {
        SaveJson(JSON.stringify(DeSchematizeProperty($scope.resource.value)));
    }
    $scope.updateMaterialize = function () {
        $timeout(function () { Materialize.updateTextFields(); Materialize.updateTextFields(); }, 500);
    }
    $scope.SetOpenFile = function (object) {
        $scope.resource = object;
        $scope.raw = object;
        $scope.options = { mode: 'tree' };
        if (!$scope.$$phase) $scope.$apply();
        $scope.updateMaterialize();
    }


    $scope.SetOpenFile(SchematizeProperty("test", test_obj));

    var IPC = require('electron').ipcRenderer;
    IPC.on('LoadSchema', (event, message) => {
        $scope.LoadSchema();
    })
    IPC.on('LoadJson', (event, message) => {
        $scope.LoadJson();
    })
    IPC.on('SaveSchema', (event, message) => {
        $scope.SaveSchema();
    })
    IPC.on('SaveJson', (event, message) => {
        $scope.SaveJson();
    })
});

app.service('AdminService', function () {
    return {};
});

function DeSchematizeProperty(key, val) {
    if (val.type == "string") {
        return val.value;
    } else if (typeof val == "boolean") {
        return val.value;

    }
    else if (val.type == "number") {
        return val.value;

    }
    else if (Object.prototype.toString.call(val.value) === '[object Array]') {
        var array = [];

        for (var i = 0; i < val.value.length; i++) {

            array.push(DeSchematizeProperty(i, val.value[i]))
        }
        return array;
    }

    else if (val.type == "object") {
        var new_obj = {};
        for (var property in val) {
            if (val.hasOwnProperty(property)) {
                new_obj[property] = DeSchematizeProperty(property, val[property]);
            }
        }
        return new_obj;
    }

}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


function SchematizeProperty(key, val) {
    if (typeof val == "string") {
        return {
            "type": "string",
            "title": key,
            "value": val,
            "options": {
                "unique_id": guid(),
            }

        }
    } else if (typeof val == "boolean") {
        return {
            "type": "boolean",
            "title": key,
            "value": val,
            "options": {
                "unique_id": guid(),
            }
        }
    }
    else if (typeof val == "number") {
        return {
            "type": "number",
            "title": key,

            "value": val,
            "options": {
                "unique_id": guid(),
            }
        }
    }
    else if (Object.prototype.toString.call(val) === '[object Array]') {
        var to_return = {
            "type": "array",
            "value": [],
            "title": key,
            "options": {
                "unique_id": guid(),
                "expanded": false,
            }
        }
        for (var i = 0; i < val.length; i++) {
            var item = val[i];
            to_return.value.push(SchematizeProperty(i, item));
        }
        return to_return;
    }

    else if (typeof val == "object") {
        var new_obj = {};
        new_obj["title"] = key;
        new_obj["type"] = "object";

        new_obj.value = {};
        new_obj.options = {
            "unique_id": guid(),
            "expanded": true,
        }

        for (var property in val) {
            if (val.hasOwnProperty(property)) {
                new_obj.value[property] = SchematizeProperty(property, val[property]);
            }
        }
        return new_obj;
    }
}
var electron = require('electron');
var remote = electron.remote;
var dialog = remote.dialog;
var editor;
var element;
window.onload = function () {

}
var fs = require('fs');
var path = require('path');


var test_obj = {
    string_ketlkjasldkjflasjdflkjaslkdfjklasjdasdfasdfasdfkahskdjfjlkasjfklasjklfjaslkf_lajsdkfhaslkdjflkasjdflkjaskldfjlaskfjd_kashkfjaslkdfjlkasdjffklasjdlkfjaslkdfj: "string_val_with_a_super_long_title_jkasdljhasdkjfhkjahsdkjfhjkasdhf",
    string_array: ['left', 'right'],
    number: 1,
    number_array: [1, 2, 3],
    object: { key: "val" },
    nested_object: {
        string: "string_val",
        string_array: ['left', 'right'],
        number: 1,
        number_array: [1, 2, 3],
        object: { key: "Key", val: "val" },
    },
    array_object: [{ key: "val" }, { key: "val" }],
    array_array: [[1, 2], [2, 4], [5, 6]],
    booleeeeen: false,
    booolellean_array: [true, false, true, false, true],
    booolellean_array2: [true, false, true, false, true]
}
var test_obj2_array_boogaloo = {
    obj_array: [{ key: 'val', spey: 'spal' }],
}