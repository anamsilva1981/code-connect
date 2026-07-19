import { useState } from 'react'
import { createPost } from '../../services/postsApi'
import AuthButton from '../atoms/AuthButton'
import AuthInput from '../atoms/AuthInput'

function CreatePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const post = await createPost({
        title: String(formData.get('title') ?? ''),
        summary: String(formData.get('summary') ?? ''),
        content: String(formData.get('content') ?? ''),
        thumbnailUrl: String(formData.get('thumbnailUrl') ?? ''),
        tags: String(formData.get('tags') ?? '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      window.location.href = `/posts/${post.id}`
    } catch {
      setErrorMessage('Nao foi possivel publicar seu post.')
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-5 rounded bg-code-panel p-5" onSubmit={handleSubmit}>
      <h1 className="m-0 text-2xl font-semibold text-code-offwhite">Novo projeto</h1>

      <AuthInput id="title" label="Titulo" name="title" placeholder="Titulo do post" required />
      <AuthInput id="summary" label="Resumo" name="summary" placeholder="Resumo do post" required />

      <label className="grid gap-2 text-lg leading-normal text-code-offwhite" htmlFor="content">
        <span>Descricao</span>
        <textarea
          className="min-h-40 w-full rounded bg-code-field px-4 py-2 text-sm text-code-panel outline-none transition-colors placeholder:text-code-panel focus:border focus:border-code-accent focus:bg-code-field-focus focus:ring-2 focus:ring-code-accent/20"
          id="content"
          name="content"
          placeholder="Conte sobre o projeto"
          required
        />
      </label>

      <AuthInput
        id="thumbnailUrl"
        label="Thumbnail"
        name="thumbnailUrl"
        placeholder="/feed/img-1-desktop.png"
      />
      <AuthInput id="tags" label="Tags" name="tags" placeholder="React, Front-end, UX" required />

      {errorMessage ? (
        <p className="m-0 rounded bg-red-950/70 p-3 text-sm text-code-offwhite" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <AuthButton disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Publicando...' : 'Publicar'}
      </AuthButton>
    </form>
  )
}

export default CreatePostForm
