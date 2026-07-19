import { api } from './authApi'

export async function listPosts({ search = '', tag = '', sort = 'recent' } = {}) {
  const response = await api.get('/posts', {
    params: {
      search: search || undefined,
      tag: tag || undefined,
      sort,
    },
  })

  return response.data
}

export async function getPost(id) {
  const response = await api.get(`/posts/${id}`)

  return response.data
}

export async function createPost({ title, summary, content, thumbnailUrl, tags }) {
  const response = await api.post('/posts', {
    title,
    summary,
    content,
    thumbnailUrl: thumbnailUrl || undefined,
    tags,
  })

  return response.data
}

export async function likePost(id) {
  const response = await api.post(`/posts/${id}/likes`)

  return response.data
}

export async function unlikePost(id) {
  const response = await api.delete(`/posts/${id}/likes`)

  return response.data
}

export async function commentPost(id, content) {
  const response = await api.post(`/posts/${id}/comments`, {
    content,
  })

  return response.data
}
