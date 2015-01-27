/*jshint esnext:true*/
/*exported RemoveOperation*/
'use strict';

module.exports = window.RemoveOperation = (function() {

var Operation = require('./operation');

function RemoveOperation() {
  Operation.apply(this, arguments);
}

RemoveOperation.prototype = Object.create(Operation.prototype);

RemoveOperation.prototype.constructor = RemoveOperation;

RemoveOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::RemoveOperation*/',
    'el.parentNode.removeChild(el);',
    '/*==*/'
  ];

  return script.join('\n');
};

return RemoveOperation;

})();
