/*jshint esnext:true*/
/*exported Operation*/
'use strict';

module.exports = window.Operation = (function() {

function Operation() {

}

Operation.prototype.constructor = Operation;

Operation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::Operation*/',
    '/*==*/'
  ];

  return script.join('\n');
};

return Operation;

})();
