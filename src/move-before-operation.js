/*jshint esnext:true*/
/*exported MoveBeforeOperation*/
'use strict';

module.exports = window.MoveBeforeOperation = (function() {

var Operation = require('./operation');

var SelectorUtils = require('./selector-utils');

function MoveBeforeOperation(target) {
  Operation.apply(this, arguments);

  this.target = target;
}

MoveBeforeOperation.prototype = Object.create(Operation.prototype);

MoveBeforeOperation.prototype.constructor = MoveBeforeOperation;

MoveBeforeOperation.prototype.getScript = function() {
  var targetSelector = SelectorUtils.getSelector(this.target);
  var script = [
    '/*=AddonGenerator::MoveBeforeOperation*/',
    'var target = document.querySelector(\'' + targetSelector + '\');',
    'if (target && target.parentNode) {',
    '  target.parentNode.insertBefore(el, target);',
    '}',
    '/*==*/'
  ];

  return script.join('\n');
};

return MoveAppendOperation;

})();
