import { useEffect, useMemo, useState } from 'react'
import PostCard from '../components/organisms/PostCard'
import SearchFilters from '../components/molecules/SearchFilters'
import FeedLayout from '../components/templates/FeedLayout'
import { getStoredSession } from '../services/authApi'
import { listPosts } from '../services/postsApi'

const DEFAULT_TAGS = ['Front-end', 'React', 'Acessibilidade']

function FeedPage() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [sort, setSort] = useState('recent')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const session = useMemo(() => getStoredSession(), [])
  const isLoggedIn = Boolean(session.accessToken)

  useEffect(() => {
    let isActive = true

    async function loadPosts() {
      setIsLoading(true)
      const response = await listPosts({
        search,
        tag: activeTag,
        sort,
      })

      if (isActive) {
        setPosts(response)
        setIsLoading(false)
      }
    }

    loadPosts().catch(() => {
      if (isActive) {
        setMessage('Nao foi possivel carregar o feed.')
        setIsLoading(false)
      }
    })

    return () => {
      isActive = false
    }
  }, [activeTag, search, sort])

  const availableTags = Array.from(new Set([...DEFAULT_TAGS, ...posts.flatMap((post) => post.tags)]))

  const handlePostChange = (nextPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === nextPost.id ? { ...post, ...nextPost } : post)),
    )
  }

  const handleClear = () => {
    setSearch('')
    setActiveTag('')
    setSort('recent')
    setMessage('')
  }

  return (
    <FeedLayout activePage="feed">
      <SearchFilters
        activeTag={activeTag}
        onClear={handleClear}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onTagChange={setActiveTag}
        search={search}
        sort={sort}
        tags={availableTags}
      />

      {message ? (
        <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light" role="status">
          {message}
        </p>
      ) : null}

      {isLoading ? (
        <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light">Carregando feed...</p>
      ) : null}

      {!isLoading && posts.length === 0 ? (
        <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light">
          Nenhum post encontrado.
        </p>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard
            activeTag={activeTag}
            isLoggedIn={isLoggedIn}
            key={post.id}
            onAuthRequired={setMessage}
            onPostChange={handlePostChange}
            onSelectTag={setActiveTag}
            post={post}
          />
        ))}
      </section>
    </FeedLayout>
  )
}

export default FeedPage
