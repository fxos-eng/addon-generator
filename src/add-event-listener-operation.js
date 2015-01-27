/*jshint esnext:true*/
/*exported AddEventListenerOperation*/
'use strict';

module.exports = window.AddEventListenerOperation = (function() {

var Operation = require('./operation');

function AddEventListenerOperation(eventName, callback) {
  Operation.apply(this, arguments);

  this.eventName = eventName;
  this.callback = callback;
}

AddEventListenerOperation.prototype = Object.create(Operation.prototype);

AddEventListenerOperation.prototype.constructor = AddEventListenerOperation;

AddEventListenerOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::AddEventListenerOperation*/',
    'el.addEventListener(\'' + this.eventName + '\', ' + this.callback + ');',
    '/*==*/'
  ];

  return script.join('\n');
};

return AddEventListenerOperation;

})();
