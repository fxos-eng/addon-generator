/*jshint esnext:true*/
/*exported AddonGenerator*/
'use strict';

module.exports = window.AddonGenerator = (function() {

var JSZip = require('../bower_components/jszip/dist/jszip.min');

var SelectorUtils             = require('./selector-utils');

var AddEventListenerOperation = require('./add-event-listener-operation');
var AppendChildOperation      = require('./append-child-operation');
var InnerHTMLOperation        = require('./inner-html-operation');
var RemoveOperation           = require('./remove-operation');
var SetAttributeOperation     = require('./set-attribute-operation');
var SetPropertyOperation      = require('./set-property-operation');
var MoveAppendOperation       = require('./move-append-operation');
var MovePrependOperation      = require('./move-prepend-operation');
var MoveAfterOperation        = require('./move-after-operation');
var MoveBeforeOperation       = require('./move-before-operation');

function AddonGenerator(element, name) {
  this.element = element;

  this.operations = [];

  this.id = 'addon' + Math.round(Math.random() * 100000000);
  this.name = name || this.id;

  this.packageMetadata = {
    installOrigin: 'http://gaiamobile.org',
    manifestURL: 'app://' + this.id + '.gaiamobile.org/update.webapp',
    version: 1
  };
  this.packageManifest = {
    name: this.name,
    package_path: '/application.zip'
  };
  this.manifest = {
    name: this.name,
    role: 'addon',
    type: 'certified',
    origin: 'app://' + this.id + '.gaiamobile.org'
  };
}

AddonGenerator.prototype.constructor = AddonGenerator;

AddonGenerator.prototype.generate = function() {
  var applicationZip = new JSZip();

  var script = [
    '/*=AddonGenerator*/',
    '(function(){',
    'var el = document.querySelector(\'' + this.getSelector() + '\');',
    'var mo = new MutationObserver(function() {',
    '  var newEl = document.querySelector(\'' + this.getSelector() + '\');',
    '  if (newEl !== el) {',
    '    el = newEl;',
    '    setTimeout(exec, 1);',
    '  }',
    '});',
    'mo.observe(document.documentElement, {',
    '  childList: true,',
    '  attributes: true,',
    '  characterData: true,',
    '  subtree: true',
    '});'
  ];

  script.push('function exec() {');
  this.operations.forEach((operation) => {
    script.push(operation.getScript());
  });
  script.push('}');

  script.push('exec();');

  script.push('})();');
  script.push('/*==*/');

  script = script.join('\n');
  console.log('******** Generated SCRIPT ********', script);

  applicationZip.file('manifest.webapp', JSON.stringify(this.manifest));
  applicationZip.file('main.js', script);

  var packageZip = new JSZip();
  packageZip.file('metadata.json', JSON.stringify(this.packageMetadata));
  packageZip.file('update.webapp', JSON.stringify(this.packageManifest));
  packageZip.file('application.zip', applicationZip.generate({ type: 'arraybuffer' }));

  return packageZip.generate({ type: 'blob' });
};

AddonGenerator.prototype.getSelector = function() {
  return SelectorUtils.getSelector(this.element);
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

AddonGenerator.prototype.moveAppend = function(target) {
  this.operations.push(new MoveAppendOperation(target));
};

AddonGenerator.prototype.movePrepend = function(target) {
  this.operations.push(new MovePrependOperation(target));
};

AddonGenerator.prototype.moveAfter = function(target) {
  this.operations.push(new MoveAfterOperation(target));
};

AddonGenerator.prototype.moveBefore = function(target) {
  this.operations.push(new MoveBeforeOperation(target));
};

return AddonGenerator;

})();
