/*jshint esnext:true*/
/*exported DuplicateOperation*/
'use strict';

module.exports = window.DuplicateOperation = (function() {

var Operation = require('./operation');

function DuplicateOperation() {
  Operation.apply(this, arguments);
}

DuplicateOperation.prototype = Object.create(Operation.prototype);

DuplicateOperation.prototype.constructor = DuplicateOperation;

DuplicateOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::DuplicateOperation*/',
    'var dup = el.cloneNode();',
    'el.parentNode.insertBefore(dup, el);',
    '/*==*/'
  ];

  return script.join('\n');
};

return DuplicateOperation;

})();
