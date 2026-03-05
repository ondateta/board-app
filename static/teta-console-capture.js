/* Teta Console Capture — Client-side script */
(function () {
  'use strict';

  var ENDPOINT = '/__teta/console-log';
  var BATCH_INTERVAL = 100;
  var MAX_QUEUE = 500;

  var queue = [];
  var timer = null;

  var origLog = console.log;
  var origWarn = console.warn;
  var origError = console.error;
  var origInfo = console.info;

  function serialize(args) {
    var result = [];
    for (var i = 0; i < args.length; i++) {
      try {
        result.push(JSON.stringify(args[i]));
      } catch (e) {
        result.push(String(args[i]));
      }
    }
    return result;
  }

  function enqueue(level, args) {
    if (queue.length >= MAX_QUEUE) {
      queue.shift();
    }
    queue.push({
      level: level,
      args: serialize(args),
      timestamp: Date.now()
    });
    if (!timer) {
      timer = setTimeout(flush, BATCH_INTERVAL);
    }
  }

  function flush() {
    timer = null;
    if (queue.length === 0) return;
    var batch = queue.splice(0);
    try {
      var body = JSON.stringify(batch);
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, body);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', ENDPOINT, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
      }
    } catch (e) {
      // Silently fail — don't break the app
    }
  }

  console.log = function () {
    origLog.apply(console, arguments);
    enqueue('log', arguments);
  };
  console.warn = function () {
    origWarn.apply(console, arguments);
    enqueue('warn', arguments);
  };
  console.error = function () {
    origError.apply(console, arguments);
    enqueue('error', arguments);
  };
  console.info = function () {
    origInfo.apply(console, arguments);
    enqueue('info', arguments);
  };

  // Capture uncaught errors
  window.addEventListener('error', function (e) {
    enqueue('error', ['[Uncaught Error] ' + (e.message || '') + ' at ' + (e.filename || '') + ':' + (e.lineno || '')]);
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function (e) {
    var reason = '';
    try { reason = JSON.stringify(e.reason); } catch (_) { reason = String(e.reason); }
    enqueue('error', ['[Unhandled Rejection] ' + reason]);
  });

  // Flush on page unload
  window.addEventListener('beforeunload', flush);
})();
