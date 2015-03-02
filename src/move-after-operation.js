/*jshint esnext:true*/
/*exported MoveAfterOperation*/
'use strict';

module.exports = window.MoveAfterOperation = (function() {

var Operation = require('./operation');

var SelectorUtils = require('./selector-utils');

function MoveAfterOperation(target) {
  Operation.apply(this, arguments);

  this.target = target;
}

MoveAfterOperation.prototype = Object.create(Operation.prototype);

MoveAfterOperation.prototype.constructor = MoveAfterOperation;

MoveAfterOperation.prototype.getScript = function() {
  var targetSelector = SelectorUtils.getSelector(this.target);
  var script = [
    '/*=AddonGenerator::MoveAfterOperation*/',
    'var target = document.querySelector(\'' + targetSelector + '\');',
    'if (target && target.parentNode) {',
    '  if (target.parentNode.lastChild === target) {',
    '    target.parentNode.appendChild(el);',
    '  }',
    '  else {',
    '    target.parentNode.insertBefore(el, target.nextSibling);',
    '  }',
    '}',
    '/*==*/'
  ];

  return script.join('\n');
};

return MoveAppendOperation;

})();
