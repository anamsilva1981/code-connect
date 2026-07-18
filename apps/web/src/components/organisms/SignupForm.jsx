import AuthButton from '../atoms/AuthButton'
import AuthCheckbox from '../atoms/AuthCheckbox'
import AuthInput from '../atoms/AuthInput'
import AuthDivider from '../molecules/AuthDivider'
import SocialLoginOption from '../molecules/SocialLoginOption'

function SignupForm() {
  return (
    <form className="auth-form signup-form">
      <div className="auth-form__header">
        <h1>Cadastro</h1>
        <p>Olá! Preencha seus dados.</p>
      </div>

      <div className="auth-form__fields">
        <AuthInput
          autoComplete="name"
          id="name"
          label="Nome"
          name="name"
          placeholder="Nome completo"
          type="text"
        />

        <AuthInput
          autoComplete="email"
          id="email"
          label="Email"
          name="email"
          placeholder="Digite seu email"
          type="email"
        />

        <AuthInput
          autoComplete="new-password"
          id="signup-password"
          label="Senha"
          name="password"
          placeholder="******"
          type="password"
        />
      </div>

      <div className="auth-form__meta auth-form__meta--signup">
        <AuthCheckbox defaultChecked id="signup-remember" label="Lembrar-me" name="remember" />
      </div>

      <AuthButton type="submit">
        Cadastrar
        <span aria-hidden="true">-&gt;</span>
      </AuthButton>

      <AuthDivider>ou entre com outras contas</AuthDivider>

      <div className="auth-form__social">
        <SocialLoginOption label="Github" logoSrc="/github.png" />
        <SocialLoginOption label="Gmail" logoSrc="/google.png" />
      </div>

      <div className="auth-form__footer signup-form__login">
        <p>Já tem conta?</p>
        <a href="/login">
          Faça seu login!
          <span className="auth-form__login-icon" aria-hidden="true"></span>
        </a>
      </div>
    </form>
  )
}

export default SignupForm
