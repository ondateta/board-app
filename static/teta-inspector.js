/* Teta Visual Editor — Inspector Script */
(function () {
  'use strict';

  console.log('[Teta Inspector] Script loaded v3');

  // Fetch persisted visual edits CSS and inject as <style> (same-origin, no CORS)
  (function loadPersistedCss() {
    fetch('/teta-visual-edits.css?_=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (css) {
        if (!css || css.trim().length < 10) {
          console.log('[Teta Inspector] No persisted CSS edits');
          return;
        }
        // Remove old injected style if any
        var old = document.getElementById('__teta_persisted_css');
        if (old) old.remove();
        var style = document.createElement('style');
        style.id = '__teta_persisted_css';
        style.textContent = css;
        document.head.appendChild(style);
        console.log('[Teta Inspector] Persisted CSS injected (' + css.length + ' chars)');
      })
      .catch(function (err) {
        console.log('[Teta Inspector] No persisted CSS file:', err.message);
      });
  })();

  let enabled = false;
  let hoveredEl = null;
  let selectedEl = null;
  let parentOrigin = null;

  const hoverOverlay = document.createElement('div');
  hoverOverlay.id = '__teta_hover';
  Object.assign(hoverOverlay.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '2147483646',
    background: 'rgba(10, 132, 255, 0.12)', border: '1.5px solid rgba(10, 132, 255, 0.6)',
    borderRadius: '2px', display: 'none', transition: 'all 80ms ease',
  });

  const selectOverlay = document.createElement('div');
  selectOverlay.id = '__teta_select';
  Object.assign(selectOverlay.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '2147483647',
    background: 'rgba(178, 90, 249, 0.10)', border: '2px solid rgba(178, 90, 249, 0.8)',
    borderRadius: '2px', display: 'none',
  });

  document.documentElement.appendChild(hoverOverlay);
  document.documentElement.appendChild(selectOverlay);

  function isAllowedOrigin(origin) {
    if (parentOrigin && origin === parentOrigin) return true;
    if (origin === 'https://teta.so' || origin.endsWith('.teta.so') || origin.endsWith('.vercel.app')) return true;
    // Allow any localhost port (Vite may auto-increment from 5173)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
    if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
    return false;
  }

  function sendToParent(data) {
    var origin = parentOrigin || '*';
    window.parent.postMessage(data, origin);
  }

  function getSelector(el) {
    if (el.id) return '#' + CSS.escape(el.id);
    var parts = [];
    var cur = el;
    while (cur && cur !== document.documentElement && cur !== document.body) {
      var seg = cur.tagName.toLowerCase();
      if (cur.id) {
        parts.unshift('#' + CSS.escape(cur.id));
        break;
      }
      if (cur.className && typeof cur.className === 'string') {
        var cls = cur.className.trim().split(/\s+/).filter(function (c) {
          return !c.startsWith('__teta');
        });
        if (cls.length) seg += '.' + cls.map(CSS.escape).join('.');
      }
      var parent = cur.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function (s) {
          return s.tagName === cur.tagName;
        });
        if (siblings.length > 1) {
          seg += ':nth-child(' + (Array.from(parent.children).indexOf(cur) + 1) + ')';
        }
      }
      parts.unshift(seg);
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }

  function getComputedSnapshot(el) {
    var cs = getComputedStyle(el);
    return {
      'padding-top': cs.paddingTop, 'padding-right': cs.paddingRight,
      'padding-bottom': cs.paddingBottom, 'padding-left': cs.paddingLeft,
      'margin-top': cs.marginTop, 'margin-right': cs.marginRight,
      'margin-bottom': cs.marginBottom, 'margin-left': cs.marginLeft,
      'gap': cs.gap, 'width': cs.width, 'height': cs.height,
      'font-size': cs.fontSize, 'font-weight': cs.fontWeight,
      'line-height': cs.lineHeight, 'text-align': cs.textAlign, 'color': cs.color,
      'background-color': cs.backgroundColor,
      'border-width': cs.borderWidth, 'border-style': cs.borderStyle,
      'border-color': cs.borderColor, 'border-radius': cs.borderRadius,
      'opacity': cs.opacity, 'display': cs.display,
    };
  }

  function positionOverlay(overlay, el) {
    var r = el.getBoundingClientRect();
    overlay.style.top = r.top + 'px';
    overlay.style.left = r.left + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';
    overlay.style.display = 'block';
  }

  function isInternal(el) {
    return el === hoverOverlay || el === selectOverlay ||
      (el.id && el.id.startsWith('__teta'));
  }

  function isAttached(el) {
    return el && document.documentElement.contains(el);
  }

  function onMouseMove(e) {
    if (!enabled) return;
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isInternal(el)) return;
    if (el === hoveredEl) return;
    hoveredEl = el;
    positionOverlay(hoverOverlay, el);
  }

  function onMouseLeave() {
    hoveredEl = null;
    hoverOverlay.style.display = 'none';
  }

  function onClick(e) {
    if (!enabled) return;
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isInternal(el)) return;
    e.preventDefault();
    e.stopPropagation();
    selectedEl = el;
    positionOverlay(selectOverlay, el);
    hoverOverlay.style.display = 'none';
    sendToParent({
      type: 'element-selected',
      selector: getSelector(el),
      tagName: el.tagName.toLowerCase(),
      computedStyles: getComputedSnapshot(el),
    });
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.type) return;
    console.log('[Teta Inspector] message:', d.type, 'from:', e.origin);
    if (d.type === 'inspect-mode' && !parentOrigin && e.origin) {
      if (isAllowedOrigin(e.origin)) {
        parentOrigin = e.origin;
        console.log('[Teta Inspector] parent origin set:', parentOrigin);
      } else {
        console.warn('[Teta Inspector] origin rejected:', e.origin);
        return;
      }
    }
    if (!parentOrigin || e.origin !== parentOrigin) {
      if (d.type === 'inspect-mode' || d.type === 'style-update') {
        console.warn('[Teta Inspector] message blocked — parentOrigin:', parentOrigin, 'e.origin:', e.origin);
      }
      return;
    }
    if (d.type === 'inspect-mode') {
      enabled = !!d.enabled;
      console.log('[Teta Inspector] inspect mode:', enabled);
      if (!enabled) {
        hoveredEl = null;
        selectedEl = null;
        hoverOverlay.style.display = 'none';
        selectOverlay.style.display = 'none';
        document.body.style.cursor = '';
      } else {
        document.body.style.cursor = 'crosshair';
      }
    }
    if (d.type === 'style-update' && d.selector) {
      try {
        var target = document.querySelector(d.selector);
      } catch (err) {
        return;
      }
      if (target && d.property && d.value !== undefined) {
        target.style.setProperty(d.property, d.value, 'important');
        if (target === selectedEl) {
          positionOverlay(selectOverlay, target);
        }
      }
    }
  });

  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseleave', onMouseLeave, true);
  document.addEventListener('click', onClick, true);

  function repositionOverlays() {
    if (hoveredEl && !isAttached(hoveredEl)) {
      hoveredEl = null;
      hoverOverlay.style.display = 'none';
    } else if (hoveredEl) {
      positionOverlay(hoverOverlay, hoveredEl);
    }
    if (selectedEl && !isAttached(selectedEl)) {
      selectedEl = null;
      selectOverlay.style.display = 'none';
      sendToParent({ type: 'element-removed' });
    } else if (selectedEl) {
      positionOverlay(selectOverlay, selectedEl);
    }
  }
  window.addEventListener('scroll', repositionOverlays, true);
  window.addEventListener('resize', repositionOverlays);
  setInterval(function () {
    if (selectedEl && !isAttached(selectedEl)) {
      selectedEl = null;
      selectOverlay.style.display = 'none';
      sendToParent({ type: 'element-removed' });
    }
  }, 1000);
})();
