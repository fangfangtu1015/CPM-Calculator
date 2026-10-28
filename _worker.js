export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Skip static assets — let Cloudflare serve them directly
    if (/\.(css|js|webp|png|jpg|svg|ico|xml|txt|woff2?)$/.test(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // Normalize: strip trailing slash (except root)
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    // Root path → serve index.html directly
    if (pathname === '/') {
      return env.ASSETS.fetch(request);
    }

    // Try serving as .html (clean URL → file.html)
    const htmlUrl = pathname + '.html';
    const htmlReq = new Request(new URL(htmlUrl, url.origin), request);
    const htmlRes = await env.ASSETS.fetch(htmlReq);

    if (htmlRes.status === 200) {
      return new Response(htmlRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Fallback: let Cloudflare handle 404
    return env.ASSETS.fetch(request);
  },
};
