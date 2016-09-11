module.exports = function () {
  var element = document.createElement('h1');
  element.innerHTML = 'Hello world!';
  element.className = 'pure-button';

  return element;
}