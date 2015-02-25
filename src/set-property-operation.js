/*jshint esnext:true*/
/*exported SetPropertyOperation*/
'use strict';

module.exports = window.SetPropertyOperation = (function() {

var Operation = require('./operation');

function SetPropertyOperation(name, value) {
  Operation.apply(this, arguments);

  this.name = name;
  this.value = value;
}

SetPropertyOperation.prototype = Object.create(Operation.prototype);

SetPropertyOperation.prototype.constructor = SetPropertyOperation;

SetPropertyOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::SetPropertyOperation*/',
    'el.' + this.name + ' = ' + JSON.stringify(this.value) + ';',
    '/*==*/'
  ];

  return script.join('\n');
};

return SetPropertyOperation;

})();
