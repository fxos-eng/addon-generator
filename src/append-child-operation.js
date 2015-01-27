/*jshint esnext:true*/
/*exported AppendChildOperation*/
'use strict';

module.exports = window.AppendChildOperation = (function() {

var Operation = require('./operation');

function AppendChildOperation(childNodeName) {
  Operation.apply(this, arguments);

  this.childNodeName = childNodeName;
}

AppendChildOperation.prototype = Object.create(Operation.prototype);

AppendChildOperation.prototype.constructor = AppendChildOperation;

AppendChildOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::AppendChildOperation*/',
    'el.appendChild(document.createElement(\'' + this.childNodeName + '\'));',
    '/*==*/'
  ];

  return script.join('\n');
};

return AppendChildOperation;

})();
