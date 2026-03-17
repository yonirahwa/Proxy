export default {
  async fetch(request) {
    const urlParam = new URL(request.url).searchParams.get('url');
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
      return new Response(Proxy error: ${err.message}, { status: 500 });
    }
  }
};