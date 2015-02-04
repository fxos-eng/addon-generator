/*jshint esnext:true*/
/*exported AddonGenerator*/
'use strict';

module.exports = window.AddonGenerator = (function() {

var JSZip = require('../bower_components/jszip/dist/jszip');

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
  var zip = new JSZip();

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

  var addonId = 'addon' + Math.round(Math.random() * 100000000);

  zip.file('metadata.json', JSON.stringify({
    installOrigin: 'http://gaiamobile.org',
    manifestURL: 'app://' + addonId + '.gaiamobile.org/manifest.webapp',
    version: 1
  }));

  zip.file('manifest.webapp', JSON.stringify({
    name: 'Addon',
    role: 'addon',
    type: 'certified',
    origin: 'app://' + addonId + '.gaiamobile.org'
  }));

  zip.file('main.js', script.join('\n'));

  return zip.generate({ type: 'blob' });
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
