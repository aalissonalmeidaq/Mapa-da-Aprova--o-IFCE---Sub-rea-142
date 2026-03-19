export const runtime = 'edge'

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  // Remove o prefixo "/api/gemini" do path
  const targetPath = url.pathname.replace(/^\/api\/gemini\/?/, '')
  // Repassa todos os query params (ex: key=..., alt=sse)
  const targetUrl = `https://generativelanguage.googleapis.com/${targetPath}${url.search}`

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const isStream = targetUrl.includes('streamGenerateContent')

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      return new Response(error, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (isStream && response.body) {
      // Pipe direto — Edge Runtime suporta streaming longo sem timeout fixo
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Proxy error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
