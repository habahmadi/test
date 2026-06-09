System.register([], function () {
  return {
    execute: function () {
      alert('XSS origin: ' + document.domain);
    }
  };
});
