import AuthButton from '../atoms/AuthButton'
import AuthCheckbox from '../atoms/AuthCheckbox'
import AuthInput from '../atoms/AuthInput'
import AuthDivider from '../molecules/AuthDivider'
import SocialLoginOption from '../molecules/SocialLoginOption'

function LoginForm() {
  return (
    <form className="login-form">
      <div className="login-form__header">
        <h1>Login</h1>
        <p>Boas-vindas! Faca seu login.</p>
      </div>

      <div className="login-form__fields">
        <AuthInput
          autoComplete="username"
          id="user"
          label="Email ou usuario"
          name="user"
          placeholder="usuario123"
          type="text"
        />

        <AuthInput
          autoComplete="current-password"
          id="password"
          label="Senha"
          name="password"
          placeholder="******"
          type="password"
        />
      </div>

      <div className="login-form__meta">
        <AuthCheckbox defaultChecked id="remember" label="Lembrar-me" name="remember" />
        <a href="/recuperar-senha">Esqueci a senha</a>
      </div>

      <AuthButton type="submit">
        Login
        <span aria-hidden="true">-&gt;</span>
      </AuthButton>

      <AuthDivider>ou entre com outras contas</AuthDivider>

      <div className="login-form__social">
        <SocialLoginOption label="Github" logoSrc="/github.png" />
        <SocialLoginOption label="Gmail" logoSrc="/google.png" />
      </div>

      <div className="login-form__signup">
        <p>Ainda nao tem conta?</p>
        <a href="/cadastro">
          Crie seu cadastro!
          <span className="login-form__signup-icon" aria-hidden="true"></span>
        </a>
      </div>
    </form>
  )
}

export default LoginForm
