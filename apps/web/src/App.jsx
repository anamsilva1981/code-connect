import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  const { pathname } = window.location

  if (pathname === '/cadastro') {
    return <SignupPage />
  }

  return <LoginPage />
}

export default App
