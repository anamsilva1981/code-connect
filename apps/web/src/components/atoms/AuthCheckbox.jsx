function AuthCheckbox({ id, label, ...props }) {
  return (
    <label
      className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm leading-normal text-code-field"
      htmlFor={id}
    >
      <input className="peer sr-only" id={id} type="checkbox" {...props} />
      <span
        className="grid size-6 place-items-center rounded border-2 border-code-field after:h-1.5 after:w-3 after:-translate-y-px after:-rotate-45 after:border-b-2 after:border-l-2 after:border-code-accent after:opacity-0 peer-checked:after:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-code-accent"
        aria-hidden="true"
      ></span>
      <span>{label}</span>
    </label>
  )
}

export default AuthCheckbox
