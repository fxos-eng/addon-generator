/*jshint esnext:true*/
/*exported SetAttributeOperation*/
'use strict';

module.exports = window.SetAttributeOperation = (function() {

var Operation = require('./operation');

function SetAttributeOperation(name, value) {
  Operation.apply(this, arguments);

  this.name = name;
  this.value = value;
}

SetAttributeOperation.prototype = Object.create(Operation.prototype);

SetAttributeOperation.prototype.constructor = SetAttributeOperation;

SetAttributeOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::SetAttributeOperation*/',
    'el.setAttribute(\'' + this.name + '\', \'' + this.value + '\');',
    '/*==*/'
  ];

  return script.join('\n');
};

return SetAttributeOperation;

})();
