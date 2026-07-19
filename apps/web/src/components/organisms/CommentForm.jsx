import { useState } from 'react'
import { commentPost } from '../../services/postsApi'
import AuthButton from '../atoms/AuthButton'

function CommentForm({ isLoggedIn, onAuthRequired, onPostChange, postId }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isLoggedIn) {
      onAuthRequired?.('Entre para comentar posts.')
      return
    }

    if (!content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const post = await commentPost(postId, content)
      setContent('')
      onPostChange?.(post)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3 rounded bg-code-panel p-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-code-gray-light">
        <span>Comentario</span>
        <textarea
          className="min-h-28 rounded bg-code-graphite p-3 text-code-offwhite outline-none ring-1 ring-code-gray-dark focus:ring-code-accent"
          onChange={(event) => setContent(event.target.value)}
          placeholder={isLoggedIn ? 'Escreva seu comentario' : 'Entre para comentar'}
          value={content}
        />
      </label>
      <AuthButton disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Enviando...' : 'Comentar'}
      </AuthButton>
    </form>
  )
}

export default CommentForm
