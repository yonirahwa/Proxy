export default {
  async fetch(request) {
    const url = new URL(request.url);

    // ==========================================
    // 1. TELEGRAM PROXY MODE 
    // Passes any /bot... paths directly to Telegram with all bodies/headers intact
    // ==========================================
    if (url.pathname.startsWith('/bot') || url.pathname.startsWith('/file/bot')) {
      url.hostname = 'api.telegram.org';
      
      // Clone the exact request (method, body, headers) and redirect
      return fetch(new Request(url.toString(), new Request(request, {
        body: request.body
      })));
    }

    // ==========================================
    // 2. YOUR ORIGINAL SCRAPER PROXY MODE
    // Used for ?url= params (kept unmodified so nothing breaks)
    // ==========================================
    const urlParam = url.searchParams.get('url');
    if (!urlParam) return new Response('Missing ?url=', { status: 400 });

    try {
      const response = await fetch(urlParam, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      });

      const body = await response.arrayBuffer();
      return new Response(body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      return new Response(`Proxy error: ${err.message}`, { status: 500 });
    }
  }
};
