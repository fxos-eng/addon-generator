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
var SetPropertyOperation      = require('./set-property-operation');

function AddonGenerator(element) {
  this.element = element;
  this.operations = [];

  this.id = 'addon' + Math.round(Math.random() * 100000000);
  this.metadata = {
    installOrigin: 'http://gaiamobile.org',
    manifestURL: 'app://' + this.id + '.gaiamobile.org/manifest.webapp',
    version: 1
  };
  this.manifest = {
    name: 'Addon',
    role: 'addon',
    type: 'certified',
    origin: 'app://' + this.id + '.gaiamobile.org'
  };
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

  script = script.join('\n');
  console.log('******** Generated SCRIPT ********', script);

  var addonId = 'addon' + Math.round(Math.random() * 100000000);

  zip.file('metadata.json', JSON.stringify(this.metadata));
  zip.file('manifest.webapp', JSON.stringify(this.manifest));

  zip.file('main.js', script);

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

AddonGenerator.prototype.setProperty = function(name, value) {
  this.operations.push(new SetPropertyOperation(name, value));
};

AddonGenerator.prototype.setProperties = function(properties) {
  for (var name in properties) {
    this.setProperty(name, properties[name]);
  }
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
