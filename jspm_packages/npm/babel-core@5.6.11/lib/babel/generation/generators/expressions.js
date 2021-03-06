/* */ 
"format cjs";
"use strict";

var _toolsProtectJs2 = require("./../../tools/protect.js");

var _toolsProtectJs3 = _interopRequireDefault(_toolsProtectJs2);

exports.__esModule = true;
exports.UnaryExpression = UnaryExpression;
exports.DoExpression = DoExpression;
exports.ParenthesizedExpression = ParenthesizedExpression;
exports.UpdateExpression = UpdateExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.NewExpression = NewExpression;
exports.SequenceExpression = SequenceExpression;
exports.ThisExpression = ThisExpression;
exports.Super = Super;
exports.Decorator = Decorator;
exports.CallExpression = CallExpression;
exports.EmptyStatement = EmptyStatement;
exports.ExpressionStatement = ExpressionStatement;
exports.AssignmentPattern = AssignmentPattern;
exports.AssignmentExpression = AssignmentExpression;
exports.BindExpression = BindExpression;
exports.MemberExpression = MemberExpression;
exports.MetaProperty = MetaProperty;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _lodashLangIsNumber = require("lodash/lang/isNumber");

var _lodashLangIsNumber2 = _interopRequireDefault(_lodashLangIsNumber);

var _types = require("../../types");

var t = _interopRequireWildcard(_types);

_toolsProtectJs3["default"](module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function UnaryExpression(node, print) {
  var needsSpace = /[a-z]$/.test(node.operator);
  var arg = node.argument;

  if (t.isUpdateExpression(arg) || t.isUnaryExpression(arg)) {
    needsSpace = true;
  }

  if (t.isUnaryExpression(arg) && arg.operator === "!") {
    needsSpace = false;
  }

  this.push(node.operator);
  if (needsSpace) this.push(" ");
  print.plain(node.argument);
}

function DoExpression(node, print) {
  this.push("do");
  this.space();
  print.plain(node.body);
}

function ParenthesizedExpression(node, print) {
  this.push("(");
  print.plain(node.expression);
  this.push(")");
}

function UpdateExpression(node, print) {
  if (node.prefix) {
    this.push(node.operator);
    print.plain(node.argument);
  } else {
    print.plain(node.argument);
    this.push(node.operator);
  }
}

function ConditionalExpression(node, print) {
  print.plain(node.test);
  this.space();
  this.push("?");
  this.space();
  print.plain(node.consequent);
  this.space();
  this.push(":");
  this.space();
  print.plain(node.alternate);
}

function NewExpression(node, print) {
  this.push("new ");
  print.plain(node.callee);
  this.push("(");
  print.list(node.arguments);
  this.push(")");
}

function SequenceExpression(node, print) {
  print.list(node.expressions);
}

function ThisExpression() {
  this.push("this");
}

function Super() {
  this.push("super");
}

function Decorator(node, print) {
  this.push("@");
  print.plain(node.expression);
  this.newline();
}

function CallExpression(node, print) {
  print.plain(node.callee);

  this.push("(");

  var isPrettyCall = node._prettyCall && !this.format.retainLines && !this.format.compact;

  var separator;
  if (isPrettyCall) {
    separator = ",\n";
    this.newline();
    this.indent();
  }

  print.list(node.arguments, { separator: separator });

  if (isPrettyCall) {
    this.newline();
    this.dedent();
  }

  this.push(")");
}

var buildYieldAwait = function buildYieldAwait(keyword) {
  return function (node, print) {
    this.push(keyword);

    if (node.delegate || node.all) {
      this.push("*");
    }

    if (node.argument) {
      this.push(" ");
      print.plain(node.argument);
    }
  };
};

var YieldExpression = buildYieldAwait("yield");
exports.YieldExpression = YieldExpression;
var AwaitExpression = buildYieldAwait("await");

exports.AwaitExpression = AwaitExpression;

function EmptyStatement() {
  this.semicolon();
}

function ExpressionStatement(node, print) {
  print.plain(node.expression);
  this.semicolon();
}

function AssignmentPattern(node, print) {
  print.plain(node.left);
  this.push(" = ");
  print.plain(node.right);
}

function AssignmentExpression(node, print) {
  // todo: add cases where the spaces can be dropped when in compact mode
  print.plain(node.left);

  var spaces = node.operator === "in" || node.operator === "instanceof";
  spaces = true; // todo: https://github.com/babel/babel/issues/1835
  this.space(spaces);

  this.push(node.operator);

  if (!spaces) {
    // space is mandatory to avoid outputting <!--
    // http://javascript.spec.whatwg.org/#comment-syntax
    spaces = node.operator === "<" && t.isUnaryExpression(node.right, { prefix: true, operator: "!" }) && t.isUnaryExpression(node.right.argument, { prefix: true, operator: "--" });
  }

  this.space(spaces);

  print.plain(node.right);
}

function BindExpression(node, print) {
  print.plain(node.object);
  this.push("::");
  print.plain(node.callee);
}

exports.BinaryExpression = AssignmentExpression;
exports.LogicalExpression = AssignmentExpression;

function MemberExpression(node, print) {
  var obj = node.object;
  print.plain(obj);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  var computed = node.computed;
  if (t.isLiteral(node.property) && _lodashLangIsNumber2["default"](node.property.value)) {
    computed = true;
  }

  if (computed) {
    this.push("[");
    print.plain(node.property);
    this.push("]");
  } else {
    this.push(".");
    print.plain(node.property);
  }
}

function MetaProperty(node, print) {
  print.plain(node.meta);
  this.push(".");
  print.plain(node.property);
}