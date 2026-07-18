function AuthCheckbox({ id, label, ...props }) {
  return (
    <label className="auth-checkbox" htmlFor={id}>
      <input id={id} type="checkbox" {...props} />
      <span className="auth-checkbox__box" aria-hidden="true"></span>
      <span>{label}</span>
    </label>
  )
}

export default AuthCheckbox
