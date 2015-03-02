/*jshint esnext:true*/
/*exported SelectorUtils*/
'use strict';

module.exports = window.SelectorUtils = (function() {

var SelectorUtils = {};

SelectorUtils.getSelector = function(element) {
  var path = [];

  var current = element;

  path.push(getSpecificSelector(current));

  while (!current.id && current.nodeName !== 'HTML') {
    current = current.parentNode;

    path.push(getSpecificSelector(current));
  }

  return path.reverse().join('>');
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

return SelectorUtils;

})();
