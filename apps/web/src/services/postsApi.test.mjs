import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const sourceUrl = new URL('./postsApi.js', import.meta.url)

test('postsApi exposes the feed endpoints through axios', async () => {
  const source = await readFile(sourceUrl, 'utf8')

  assert.match(source, /api\.get\('\/posts'/)
  assert.match(source, /api\.get\(`\/posts\/\$\{id\}`\)/)
  assert.match(source, /api\.post\('\/posts'/)
  assert.match(source, /api\.post\(`\/posts\/\$\{id\}\/likes`\)/)
  assert.match(source, /api\.delete\(`\/posts\/\$\{id\}\/likes`\)/)
  assert.match(source, /api\.post\(`\/posts\/\$\{id\}\/comments`,/)
})
