function AuthInput({ id, label, ...props }) {
  return (
    <label className="grid gap-2 text-lg leading-normal text-code-offwhite" htmlFor={id}>
      <span>{label}</span>
      <input
        className="min-h-10 w-full rounded bg-code-field px-4 py-2 text-sm text-code-panel outline-none transition-colors placeholder:text-code-panel focus:border focus:border-code-accent focus:bg-code-field-focus focus:ring-2 focus:ring-code-accent/20"
        id={id}
        {...props}
      />
    </label>
  )
}

export default AuthInput
