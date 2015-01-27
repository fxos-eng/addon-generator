window.addEventListener('load', function() {
  var test = document.getElementById('test');

  Array.prototype.forEach.call(test.children, (child) => {
    var generator = new AddonGenerator(child);
    console.log(generator.getSelector());

    generator.innerHTML('<button type="button">something new</button>');
    generator.addEventListener('click', 'function(){ alert(\'clicked!\'); }');
    generator.setAttribute('class', 'my-custom-class');
    generator.appendChild('div');

    console.log(generator.generate());
  });
});
