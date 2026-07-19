import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('feed page uses backend search and post cards', async () => {
  const source = await readSource('../../pages/FeedPage.jsx')

  assert.match(source, /listPosts/)
  assert.match(source, /SearchFilters/)
  assert.match(source, /PostCard/)
  assert.match(source, /isLoggedIn/)
})

test('post detail page reuses post card pieces and comments', async () => {
  const source = await readSource('../../pages/PostDetailPage.jsx')

  assert.match(source, /getPost/)
  assert.match(source, /PostDetailCard/)
  assert.match(source, /CommentForm/)
  assert.match(source, /CommentList/)
})

test('post thumbnail has a placeholder fallback', async () => {
  const source = await readSource('../molecules/PostThumbnail.jsx')

  assert.match(source, /PLACEHOLDER_SRC/)
  assert.match(source, /onError/)
  assert.match(source, /placeholder-desktop/)
})
