// Teta Visual Editor — Server Hook (auto-generated, do not remove)
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Console log capture endpoint — receives batched logs from teta-console-capture.js
  if (event.url.pathname === '/__teta/console-log' && event.request.method === 'POST') {
    try {
      const body = await event.request.json();
      const fs = await import('fs');
      const entries = Array.isArray(body) ? body : [body];
      const lines = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
      fs.appendFileSync('/tmp/teta-console-logs.jsonl', lines);
    } catch (e) {
      // Silently ignore malformed requests
    }
    return new Response('ok');
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      if (html.includes('</body>')) {
        let inject = '';
        if (!html.includes('teta-inspector.js')) {
          inject += '<script src="/teta-inspector.js?v=' + Date.now() + '"><\/script>\n';
        }
        if (!html.includes('teta-console-capture.js')) {
          inject += '<script src="/teta-console-capture.js?v=' + Date.now() + '"><\/script>\n';
        }
        if (inject) {
          html = html.replace('</body>', inject + '</body>');
        }
      }
      return html;
    }
  });
}
