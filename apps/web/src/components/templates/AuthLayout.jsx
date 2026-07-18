function AuthLayout({ bannerAlt, bannerSrc, children }) {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label="Autenticacao">
        <div className="auth-banner">
          <img src={bannerSrc} alt={bannerAlt} />
        </div>

        <div className="auth-panel">{children}</div>
      </section>
    </main>
  )
}

export default AuthLayout
