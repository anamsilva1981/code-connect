function AuthDivider({ children }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-code-offwhite max-[480px]:gap-2">
      <span className="h-px bg-code-field"></span>
      <p className="m-0 whitespace-nowrap text-sm leading-normal max-[480px]:text-xs">{children}</p>
      <span className="h-px bg-code-field"></span>
    </div>
  )
}

export default AuthDivider
