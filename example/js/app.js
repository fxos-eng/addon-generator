window.addEventListener('load', function() {
  var test = document.getElementById('test');

  Array.prototype.forEach.call(test.children, (child) => {
    var generator = new AddonGenerator(child);
    console.log(generator.getSelector());

    generator.innerHTML('<button type="button">something new</button>');
    // generator.addEventListener('click', 'function(){ alert(\'clicked!\'); }');
    // generator.setAttribute('class', 'my-custom-class');
    // generator.appendChild('div');

    var addonBlob = new Blob([generator.generate()], { type: 'application/zip' });

    var downloadLink = document.createElement('a');
    downloadLink.innerHTML = 'Download Add-on<br>';
    downloadLink.href = window.URL.createObjectURL(addonBlob);
    document.body.appendChild(downloadLink);

    blobToArrayBuffer(addonBlob, function(arrayBuffer) {
      var zipReader = new JSZip();
      zipReader.load(arrayBuffer);
      console.log(zipReader.files);

      var nestedZipReader = new JSZip();
      nestedZipReader.load(zipReader.file('application.zip').asArrayBuffer());
      console.log(nestedZipReader.files);
    });
  });
});

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
