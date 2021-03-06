/* */ 
"format cjs";
"use strict";

var _toolsProtectJs2 = require("./../../../tools/protect.js");

var _toolsProtectJs3 = _interopRequireDefault(_toolsProtectJs2);

exports.__esModule = true;
exports.manipulateOptions = manipulateOptions;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _helpersRemapAsyncToGenerator = require("../../helpers/remap-async-to-generator");

var _helpersRemapAsyncToGenerator2 = _interopRequireDefault(_helpersRemapAsyncToGenerator);

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

_toolsProtectJs3["default"](module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function manipulateOptions(opts) {
  opts.blacklist.push("regenerator");
}

var metadata = {
  optional: true,
  dependencies: ["es7.asyncFunctions", "es6.classes"]
};

exports.metadata = metadata;
var visitor = {
  Function: function Function(node, parent, scope, file) {
    if (!node.async || node.generator) return;

    return _helpersRemapAsyncToGenerator2["default"](this, t.memberExpression(file.addImport("bluebird", null, "absolute"), t.identifier("coroutine")));
  }
};
exports.visitor = visitor;