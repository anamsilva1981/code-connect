import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { clearSession, getStoredSession, saveSession } from './authApi.js'

function createLocalStorage() {
  const entries = new Map()

  return {
    getItem(key) {
      return entries.get(key) ?? null
    },
    removeItem(key) {
      entries.delete(key)
    },
    setItem(key, value) {
      entries.set(key, String(value))
    },
  }
}

beforeEach(() => {
  globalThis.window = {
    localStorage: createLocalStorage(),
  }
})

test('saveSession and getStoredSession persist the logged user and token', () => {
  const user = {
    id: 'user-id',
    name: 'Ada Lovelace',
    email: 'ada@codeconnect.dev',
  }

  saveSession({
    accessToken: 'access-token',
    user,
  })

  assert.deepEqual(getStoredSession(), {
    accessToken: 'access-token',
    user,
  })
})

test('saveSession keeps a registered user without a token', () => {
  const user = {
    id: 'user-id',
    name: 'Ada Lovelace',
    email: 'ada@codeconnect.dev',
  }

  saveSession({
    accessToken: null,
    user,
  })

  assert.deepEqual(getStoredSession(), {
    accessToken: null,
    user,
  })
})

test('clearSession removes saved auth data', () => {
  saveSession({
    accessToken: 'access-token',
    user: {
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    },
  })

  clearSession()

  assert.deepEqual(getStoredSession(), {
    accessToken: null,
    user: null,
  })
})
