function AuthButton({ children, icon, variant = 'primary', ...props }) {
  const variants = {
    primary:
      'min-h-[51px] w-full rounded-lg bg-code-accent px-4 py-3 text-lg font-semibold text-code-petroleum transition hover:-translate-y-px hover:bg-code-accent-hover hover:shadow-lg hover:shadow-code-accent/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-code-accent',
    social:
      'grid justify-items-center gap-1 bg-transparent text-xs leading-normal text-code-offwhite transition hover:-translate-y-px',
  }

  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 border-0 ${variants[variant]}`}
      type="button"
      {...props}
    >
      {icon ? <span className="grid place-items-center">{icon}</span> : null}
      {children}
    </button>
  )
}

export default AuthButton
