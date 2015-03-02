/*jshint esnext:true*/
/*exported MovePrependOperation*/
'use strict';

module.exports = window.MovePrependOperation = (function() {

var Operation = require('./operation');

var SelectorUtils = require('./selector-utils');

function MovePrependOperation(target) {
  Operation.apply(this, arguments);

  this.target = target;
}

MovePrependOperation.prototype = Object.create(Operation.prototype);

MovePrependOperation.prototype.constructor = MovePrependOperation;

MovePrependOperation.prototype.getScript = function() {
  var targetSelector = SelectorUtils.getSelector(this.target);
  var script = [
    '/*=AddonGenerator::MovePrependOperation*/',
    'var target = document.querySelector(\'' + targetSelector + '\');',
    'if (target) {',
    '  target.insertBefore(el, target.firstChild);',
    '}',
    '/*==*/'
  ];

  return script.join('\n');
};

return MoveAppendOperation;

})();
