import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const targetPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || ''
  const targetUrl = `https://api.deepseek.com/${targetPath}`

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization as string
    }

    const isStream = req.body?.stream === true

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).send(errorText)
    }

    if (isStream && response.body) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(decoder.decode(value, { stream: true }))
      }
      res.end()
    } else {
      const data = await response.json()
      return res.status(200).json(data)
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Proxy error' })
  }
}
