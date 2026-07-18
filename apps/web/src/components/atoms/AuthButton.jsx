function AuthButton({ children, icon, variant = 'primary', ...props }) {
  return (
    <button className={`auth-button auth-button--${variant}`} type="button" {...props}>
      {icon ? <span className="auth-button__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}

export default AuthButton
