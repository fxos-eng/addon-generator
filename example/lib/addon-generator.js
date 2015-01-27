!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.AddonGenerator=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./operation":5}],2:[function(require,module,exports){
/*jshint esnext:true*/
/*exported AddonGenerator*/
'use strict';

module.exports = window.AddonGenerator = (function() {

var AddEventListenerOperation = require('./add-event-listener-operation');
var AppendChildOperation      = require('./append-child-operation');
var InnerHTMLOperation        = require('./inner-html-operation');
var RemoveOperation           = require('./remove-operation');
var SetAttributeOperation     = require('./set-attribute-operation');

function AddonGenerator(element) {
  this.element = element;
  this.operations = [];
}

AddonGenerator.prototype.constructor = AddonGenerator;

AddonGenerator.prototype.generate = function() {
  var script = [
    '/*=AddonGenerator*/',
    '(function(){',
    'var el = document.querySelector(\'' + this.getSelector() + '\');'
  ];

  this.operations.forEach((operation) => {
    script.push(operation.getScript());
  });

  script.push('})();');
  script.push('/*==*/');

  return script.join('\n');
};

AddonGenerator.prototype.getSelector = function() {
  var path = [];

  var current = this.element;

  path.push(getSpecificSelector(current));

  while (!current.id && current.nodeName !== 'BODY') {
    current = current.parentNode;

    path.push(getSpecificSelector(current));
  }

  return path.reverse().join('>');
};

AddonGenerator.prototype.addEventListener = function(eventName, callback) {
  this.operations.push(new AddEventListenerOperation(eventName, callback));
};

AddonGenerator.prototype.appendChild = function(childNodeName) {
  this.operations.push(new AppendChildOperation(childNodeName));
};

AddonGenerator.prototype.innerHTML = function(html) {
  this.operations.push(new InnerHTMLOperation(html));
};

AddonGenerator.prototype.remove = function() {
  this.operations.push(new RemoveOperation());
};

AddonGenerator.prototype.setAttribute = function(name, value) {
  this.operations.push(new SetAttributeOperation(name, value));
};

function getSpecificSelector(element) {
  var selector = element.nodeName;

  if (element.id) {
    selector += '#' + element.id;
    return selector;
  }

  Array.prototype.forEach.call(element.classList, (item) => {
    selector += '.' + item;
  });

  Array.prototype.forEach.call(element.attributes, (attr) => {
    if (attr.nodeName.toLowerCase() === 'class') {
      return;
    }

    selector += '[' + attr.nodeName + '="' + attr.nodeValue + '"]';
  });

  return selector;
}

return AddonGenerator;

})();

},{"./add-event-listener-operation":1,"./append-child-operation":3,"./inner-html-operation":4,"./remove-operation":6,"./set-attribute-operation":7}],3:[function(require,module,exports){
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

},{"./operation":5}],4:[function(require,module,exports){
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

},{"./operation":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./operation":5}],7:[function(require,module,exports){
/*jshint esnext:true*/
/*exported SetAttributeOperation*/
'use strict';

module.exports = window.SetAttributeOperation = (function() {

var Operation = require('./operation');

function SetAttributeOperation(name, value) {
  Operation.apply(this, arguments);

  this.name = name;
  this.value = value;
}

SetAttributeOperation.prototype = Object.create(Operation.prototype);

SetAttributeOperation.prototype.constructor = SetAttributeOperation;

SetAttributeOperation.prototype.getScript = function() {
  var script = [
    '/*=AddonGenerator::SetAttributeOperation*/',
    'el.setAttribute(\'' + this.name + '\', \'' + this.value + '\');',
    '/*==*/'
  ];

  return script.join('\n');
};

return SetAttributeOperation;

})();

},{"./operation":5}]},{},[2])(2)
});