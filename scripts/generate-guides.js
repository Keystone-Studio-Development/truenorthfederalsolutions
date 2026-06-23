const fs = require('fs').promises
const path = require('path')

;(async () => {
  try {
    const guidesDir = path.join(process.cwd(), 'public', 'guides')
    // Ensure the directory exists
    await fs.mkdir(guidesDir, { recursive: true })
    const files = await fs.readdir(guidesDir).catch(() => [])
    // Determine base URL for links. Use NUXT_APP_BASE_URL if present (set in CI), otherwise default to '/'
    const rawBase = process.env.NUXT_APP_BASE_URL || process.env.BASE_URL || '/'
    // Normalize: ensure it starts and ends with a single '/'
    let baseUrl = String(rawBase || '/')
    if (!baseUrl.startsWith('/')) baseUrl = '/' + baseUrl
    if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/'

    const outPath = path.join(guidesDir, 'index.json')

    // Preserve any curated metadata (friendly name + description) from the existing
    // index so regenerating doesn't wipe hand-written entries. Keyed by the PDF's
    // filename (decoded last segment of its URL) so it matches files on disk.
    const curated = new Map()
    try {
      const prev = JSON.parse(await fs.readFile(outPath, 'utf8'))
      for (const entry of prev?.files || []) {
        const fileName = decodeURIComponent((entry.url || '').split('/').pop() || '')
        if (fileName) curated.set(fileName, entry)
      }
    } catch {
      // No existing index (or unreadable) — start fresh.
    }

    const pdfs = (files || [])
      .filter((f) => f.toLowerCase().endsWith('.pdf'))
      .map((f) => {
        const meta = curated.get(f) || {}
        return {
          name: meta.name || f,
          description: meta.description || '',
          url: `${baseUrl}guides/${encodeURIComponent(f)}`
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    await fs.writeFile(outPath, JSON.stringify({ files: pdfs }, null, 2), 'utf8')
    console.log('Generated', outPath)
  } catch (err) {
    console.error('Error generating guides index:', err)
    process.exitCode = 1
  }
})()
