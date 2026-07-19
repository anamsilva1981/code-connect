import axios from 'axios'

const ACCESS_TOKEN_KEY = 'code_connect_access_token'
const USER_KEY = 'code_connect_user'

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? 'http://localhost:3000',
})

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

api.interceptors.request.use((config) => {
  const session = getStoredSession()

  if (session.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

export function saveSession({ accessToken, user }) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  if (accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken)
  } else {
    storage.removeItem(ACCESS_TOKEN_KEY)
  }

  storage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.removeItem(ACCESS_TOKEN_KEY)
  storage.removeItem(USER_KEY)
}

export function getStoredSession() {
  const storage = getStorage()

  if (!storage) {
    return {
      accessToken: null,
      user: null,
    }
  }

  const accessToken = storage.getItem(ACCESS_TOKEN_KEY)
  const storedUser = storage.getItem(USER_KEY)

  if (!storedUser) {
    return {
      accessToken,
      user: null,
    }
  }

  try {
    return {
      accessToken,
      user: JSON.parse(storedUser),
    }
  } catch {
    clearSession()

    return {
      accessToken: null,
      user: null,
    }
  }
}

export async function register({ name, email, password }) {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  })

  return response.data
}

export async function login({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password,
  })

  saveSession(response.data)

  return response.data
}

export async function getProfile() {
  const response = await api.get('/auth/me')

  return response.data
}

export function getAuthErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message

    if (Array.isArray(message)) {
      return message.join(' ')
    }

    if (typeof message === 'string') {
      return message
    }
  }

  return fallbackMessage
}
