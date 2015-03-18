/*jshint esnext:true*/
/*exported AddonMerger*/
'use strict';

module.exports = window.AddonMerger = (function() {

var JSZip = require('../bower_components/jszip/dist/jszip');

function AddonMerger(name) {
  this.blobs = [];

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

AddonMerger.prototype.constructor = AddonMerger;

AddonMerger.prototype.merge = function(callback) {
  if (typeof callback !== 'function') {
    return;
  }

  var scripts = [];
  var error = false;

  this.blobs.forEach((blob) => {
    blobToArrayBuffer(blob, (arrayBuffer) => {
      if (error) {
        return;
      }

      var zip = new JSZip();
      zip.load(arrayBuffer);

      var applicationZipFile = zip.file('application.zip');
      if (!applicationZipFile) {
        error = true;
        callback();
        return;
      }

      var applicationZip = new JSZip();
      applicationZip.load(applicationZipFile.asArrayBuffer());

      var scriptFile = applicationZip.file('main.js');
      if (!scriptFile) {
        error = true;
        callback();
        return;
      }

      scripts.push(scriptFile.asText());

      if (scripts.length === this.blobs.length) {
        callback(packageZip(this, scripts.join('\n')));
      }
    });
  });
};

AddonMerger.prototype.add = function(blob) {
  this.blobs.push(blob);
};

function packageZip(merger, script) {
  var applicationZip = new JSZip();
  applicationZip.file('manifest.webapp', JSON.stringify(merger.manifest));
  applicationZip.file('main.js', script);

  var packageZip = new JSZip();
  packageZip.file('metadata.json', JSON.stringify(merger.packageMetadata));
  packageZip.file('update.webapp', JSON.stringify(merger.packageManifest));
  packageZip.file('application.zip', applicationZip.generate({ type: 'arraybuffer' }));

  return packageZip.generate({ type: 'arraybuffer' });
}

function blobToArrayBuffer(blob, callback) {
  var fileReader = new FileReader();
  fileReader.onload = function() {
    if (typeof callback === 'function') {
      callback(fileReader.result);
    }
  };
  fileReader.readAsArrayBuffer(blob);

  return fileReader.result;
}

return AddonMerger;

})();