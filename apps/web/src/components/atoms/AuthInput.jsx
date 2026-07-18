function AuthInput({ id, label, ...props }) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
    </label>
  )
}

export default AuthInput
