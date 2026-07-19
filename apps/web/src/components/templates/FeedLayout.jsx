import { useState } from 'react'
import { clearSession, getStoredSession } from '../../services/authApi'

function FeedLayout({ activePage = 'feed', children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const isSignedIn = Boolean(session.user)

  const handleLogout = () => {
    clearSession()
    setSession({
      accessToken: null,
      user: null,
    })
    window.location.href = '/feed'
  }

  const menuItems = [
    { href: '/feed', icon: 'feed', key: 'feed', label: 'Feed' },
    { href: '#perfil', icon: 'account', key: 'profile', label: 'Perfil' },
    { href: '#sobre', icon: 'info', key: 'about', label: 'Sobre nos' },
  ]

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-start gap-7 px-4 py-10 lg:px-0 lg:py-14">
      <aside className="sticky top-6 hidden min-h-[calc(100svh-112px)] w-44 shrink-0 rounded-lg bg-code-panel px-4 py-10 lg:grid lg:content-start lg:gap-20">
        <a className="text-xl font-semibold leading-tight text-code-offwhite no-underline" href="/feed">
          code
          <br />
          connect
        </a>

        <nav className="grid gap-8 text-center">
          <a
            className="rounded-lg border border-code-accent px-4 py-3 text-code-accent no-underline hover:bg-code-accent hover:text-code-panel"
            href="/publicar"
          >
            Publicar
          </a>

          {menuItems.map((item) => (
            <a
              className={`grid justify-items-center gap-2 px-2 py-2 text-lg no-underline ${
                activePage === item.key ? 'text-code-offwhite' : 'text-code-field'
              }`}
              href={item.href}
              key={item.key}
            >
              <span aria-hidden="true" className="text-xl">
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}

          {isSignedIn ? (
            <button
              className="grid justify-items-center gap-2 border-0 bg-transparent px-2 py-2 text-lg text-code-field"
              onClick={handleLogout}
              type="button"
            >
              <span aria-hidden="true" className="text-xl">
                logout
              </span>
              Sair
            </button>
          ) : (
            <a className="grid justify-items-center gap-2 px-2 py-2 text-lg text-code-field no-underline" href="/login">
              <span aria-hidden="true" className="text-xl">
                login
              </span>
              Login
            </a>
          )}
        </nav>
      </aside>

      <section className="grid min-w-0 flex-1 gap-10 pb-24">{children}</section>

      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 bg-code-panel px-2 py-3 text-xs text-code-field shadow-[0_-8px_20px_rgba(0,0,0,0.24)] lg:hidden">
        <a className="grid justify-items-center text-code-offwhite no-underline" href="/feed">
          <span>feed</span>
          Feed
        </a>
        <a className="grid justify-items-center text-code-field no-underline" href="/publicar">
          <span>post</span>
          Publicar
        </a>
        <a className="grid justify-items-center text-code-field no-underline" href="#sobre">
          <span>info</span>
          Sobre
        </a>
        {isSignedIn ? (
          <button className="grid justify-items-center border-0 bg-transparent text-code-field" onClick={handleLogout} type="button">
            <span>logout</span>
            Sair
          </button>
        ) : (
          <a className="grid justify-items-center text-code-field no-underline" href="/login">
            <span>login</span>
            Login
          </a>
        )}
      </nav>
    </main>
  )
}

export default FeedLayout
