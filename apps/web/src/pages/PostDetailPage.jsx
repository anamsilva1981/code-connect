import { useEffect, useMemo, useState } from 'react'
import CommentForm from '../components/organisms/CommentForm'
import CommentList from '../components/organisms/CommentList'
import PostDetailCard from '../components/organisms/PostDetailCard'
import FeedLayout from '../components/templates/FeedLayout'
import { getStoredSession } from '../services/authApi'
import { getPost } from '../services/postsApi'

function PostDetailPage({ postId }) {
  const [post, setPost] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const session = useMemo(() => getStoredSession(), [])
  const isLoggedIn = Boolean(session.accessToken)

  useEffect(() => {
    let isActive = true

    getPost(postId)
      .then((response) => {
        if (isActive) {
          setPost(response)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isActive) {
          setMessage('Post nao encontrado.')
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [postId])

  return (
    <FeedLayout activePage="feed">
      <a className="text-code-accent no-underline hover:underline" href="/feed">
        Voltar para o feed
      </a>

      {message ? (
        <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light" role="status">
          {message}
        </p>
      ) : null}

      {isLoading ? (
        <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light">Carregando post...</p>
      ) : null}

      {post ? (
        <>
          <PostDetailCard
            isLoggedIn={isLoggedIn}
            onAuthRequired={setMessage}
            onPostChange={setPost}
            post={post}
          />

          <section className="grid gap-4">
            <h2 className="m-0 text-xl font-semibold text-code-offwhite">Comentarios</h2>
            <CommentForm
              isLoggedIn={isLoggedIn}
              onAuthRequired={setMessage}
              onPostChange={setPost}
              postId={post.id}
            />
            <CommentList comments={post.comments} />
          </section>
        </>
      ) : null}
    </FeedLayout>
  )
}

export default PostDetailPage
