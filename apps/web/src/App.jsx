import CreatePostPage from './pages/CreatePostPage'
import FeedPage from './pages/FeedPage'
import LoginPage from './pages/LoginPage'
import PostDetailPage from './pages/PostDetailPage'
import SignupPage from './pages/SignupPage'

function App() {
  const { pathname } = window.location

  if (pathname === '/' || pathname === '/feed') {
    return <FeedPage />
  }

  if (pathname === '/publicar') {
    return <CreatePostPage />
  }

  if (pathname.startsWith('/posts/')) {
    return <PostDetailPage postId={pathname.split('/posts/')[1]} />
  }

  if (pathname === '/login') {
    return <LoginPage />
  }

  if (pathname === '/cadastro') {
    return <SignupPage />
  }

  return <FeedPage />
}

export default App
