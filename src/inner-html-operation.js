/*jshint esnext:true*/
/*exported InnerHTMLOperation*/
'use strict';

module.exports = window.InnerHTMLOperation = (function() {

var Operation = require('./operation');

function InnerHTMLOperation(html) {
  Operation.apply(this, arguments);

  this.html = html;
}

InnerHTMLOperation.prototype = Object.create(Operation.prototype);

InnerHTMLOperation.prototype.constructor = InnerHTMLOperation;

InnerHTMLOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::InnerHTMLOperation*/',
    'el.innerHTML=' + JSON.stringify(this.html) + ';',
    '/*==*/'
  ];

  return script.join('\n');
};

return InnerHTMLOperation;

})();
