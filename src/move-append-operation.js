/*jshint esnext:true*/
/*exported MoveAppendOperation*/
'use strict';

module.exports = window.MoveAppendOperation = (function() {

var Operation = require('./operation');

var SelectorUtils = require('./selector-utils');

function MoveAppendOperation(target) {
  Operation.apply(this, arguments);

  this.target = target;
}

MoveAppendOperation.prototype = Object.create(Operation.prototype);

MoveAppendOperation.prototype.constructor = MoveAppendOperation;

MoveAppendOperation.prototype.getScript = function() {
  var targetSelector = SelectorUtils.getSelector(this.target);
  var script = [
    '/*=AddonGenerator::MoveAppendOperation*/',
    'var target = document.querySelector(\'' + targetSelector + '\');',
    'if (target) {',
    '  target.appendChild(el);',
    '}',
    '/*==*/'
  ];

  return script.join('\n');
};

return MoveAppendOperation;

})();
