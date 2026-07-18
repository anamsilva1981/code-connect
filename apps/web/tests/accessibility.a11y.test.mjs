import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { after, before, describe, test } from 'node:test'

const baseUrl = 'http://127.0.0.1:4173'
const pages = [
  { name: 'login', path: '/login' },
  { name: 'cadastro', path: '/cadastro' },
]

let browser
let preview

describe('WCAG A/AA automated accessibility checks', () => {
  before(async () => {
    preview = spawn(
      process.execPath,
      ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'],
      {
        cwd: new URL('..', import.meta.url),
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )

    preview.stdout.on('data', () => {})
    preview.stderr.on('data', () => {})

    await waitForServer(baseUrl)
    browser = await chromium.launch({ channel: 'chrome' })
  })

  after(async () => {
    await browser?.close()
    await stopPreview()
  })

  for (const pageInfo of pages) {
    test(`${pageInfo.name} has no automated WCAG A/AA violations`, async () => {
      const context = await browser.newContext()
      const page = await context.newPage()

      try {
        await page.goto(`${baseUrl}${pageInfo.path}`)

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()

        assert.deepEqual(formatViolations(results.violations), [])
      } finally {
        await context.close()
      }
    })
  }
})

async function waitForServer(url) {
  const started = Date.now()
  const timeout = 30000

  while (Date.now() - started < timeout) {
    if (preview.exitCode !== null) {
      throw new Error(`Preview server exited with code ${preview.exitCode}`)
    }

    try {
      const response = await fetch(url)

      if (response.ok) {
        return
      }
    } catch {
      await delay(250)
    }
  }

  throw new Error(`Preview server did not start within ${timeout}ms`)
}

async function stopPreview() {
  if (!preview || preview.exitCode !== null) {
    return
  }

  preview.kill()

  try {
    await Promise.race([once(preview, 'exit'), delay(5000)])
  } finally {
    if (preview.exitCode === null) {
      preview.kill('SIGKILL')
    }
  }
}

function formatViolations(violations) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    tags: violation.tags.filter((tag) => tag.startsWith('wcag')),
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary,
    })),
  }))
}
