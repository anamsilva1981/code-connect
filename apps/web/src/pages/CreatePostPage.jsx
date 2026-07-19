import CreatePostForm from '../components/organisms/CreatePostForm'
import FeedLayout from '../components/templates/FeedLayout'
import { getStoredSession } from '../services/authApi'

function CreatePostPage() {
  const session = getStoredSession()

  return (
    <FeedLayout activePage="feed">
      {session.accessToken ? (
        <CreatePostForm />
      ) : (
        <section className="grid gap-4 rounded bg-code-panel p-5 text-code-gray-light">
          <h1 className="m-0 text-2xl font-semibold text-code-offwhite">Publicar</h1>
          <p className="m-0">Entre com sua conta para criar posts.</p>
          <a
            className="inline-flex w-fit rounded-lg border border-code-accent px-4 py-3 text-code-accent no-underline hover:bg-code-accent hover:text-code-panel"
            href="/login"
          >
            Fazer login
          </a>
        </section>
      )}
    </FeedLayout>
  )
}

export default CreatePostPage
