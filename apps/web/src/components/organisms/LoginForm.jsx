import { useState } from 'react'
import AuthButton from '../atoms/AuthButton'
import AuthCheckbox from '../atoms/AuthCheckbox'
import AuthInput from '../atoms/AuthInput'
import AuthDivider from '../molecules/AuthDivider'
import SocialLoginOption from '../molecules/SocialLoginOption'
import {
  clearSession,
  getAuthErrorMessage,
  getProfile,
  getStoredSession,
  login,
} from '../../services/authApi'

function LoginForm() {
  const [session, setSession] = useState(() => getStoredSession())
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await login({
        email: String(formData.get('user') ?? ''),
        password: String(formData.get('password') ?? ''),
      })

      setSession({
        accessToken: response.accessToken,
        user: response.user,
      })
    } catch (error) {
      setErrorMessage(
        getAuthErrorMessage(error, 'Nao foi possivel fazer login. Confira seus dados.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRefreshProfile = async () => {
    setErrorMessage('')
    setIsRefreshingProfile(true)

    try {
      const user = await getProfile()

      setSession((currentSession) => ({
        ...currentSession,
        user,
      }))
    } catch (error) {
      setErrorMessage(
        getAuthErrorMessage(error, 'Sua sessao expirou. Faca login novamente.'),
      )
    } finally {
      setIsRefreshingProfile(false)
    }
  }

  const handleLogout = () => {
    clearSession()
    setSession({
      accessToken: null,
      user: null,
    })
    setErrorMessage('')
  }

  if (session.user) {
    return (
      <section className="grid w-full gap-6 text-left text-code-offwhite">
        <div className="grid gap-3">
          <h1 className="m-0 text-3xl font-semibold leading-normal text-code-offwhite">
            Login
          </h1>
          <p className="m-0 text-xl leading-normal text-code-offwhite">
            Voce esta conectado.
          </p>
        </div>

        <div className="grid gap-2 rounded-lg bg-code-field/20 p-4 text-code-offwhite">
          <strong className="text-lg">{session.user.name}</strong>
          <span className="text-sm">{session.user.email}</span>
        </div>

        {errorMessage ? (
          <p className="m-0 rounded bg-red-950/70 p-3 text-sm text-code-offwhite" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {session.accessToken ? (
          <AuthButton
            disabled={isRefreshingProfile}
            onClick={handleRefreshProfile}
            type="button"
          >
            {isRefreshingProfile ? 'Atualizando...' : 'Atualizar perfil'}
          </AuthButton>
        ) : null}

        <AuthButton onClick={handleLogout} type="button">
          Sair
        </AuthButton>
      </section>
    )
  }

  return (
    <form className="grid w-full gap-6 text-left text-code-offwhite" onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <h1 className="m-0 text-3xl font-semibold leading-normal text-code-offwhite">
          Login
        </h1>
        <p className="m-0 text-xl leading-normal text-code-offwhite">
          Boas-vindas! Faça seu login.
        </p>
      </div>

      <div className="grid gap-4">
        <AuthInput
          autoComplete="username"
          id="user"
          label="Email ou usuário"
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

      <div className="flex items-center justify-between gap-4 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2.5">
        <AuthCheckbox defaultChecked id="remember" label="Lembrar-me" name="remember" />
        <a
          className="text-sm text-code-offwhite underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-code-accent"
          href="/recuperar-senha"
        >
          Esqueci a senha
        </a>
      </div>

      {errorMessage ? (
        <p className="m-0 rounded bg-red-950/70 p-3 text-sm text-code-offwhite" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <AuthButton type="submit">
        {isSubmitting ? 'Entrando...' : 'Login'}
        <span aria-hidden="true">-&gt;</span>
      </AuthButton>

      <AuthDivider>ou entre com outras contas</AuthDivider>

      <div className="flex justify-center gap-6">
        <SocialLoginOption label="Github" logoSrc="/github.png" />
        <SocialLoginOption label="Gmail" logoSrc="/google.png" />
      </div>

      <div className="flex items-center justify-center gap-2 max-[760px]:flex-col max-[760px]:items-start">
        <p className="m-0 whitespace-nowrap text-lg leading-normal text-code-offwhite">
          Ainda não tem conta?
        </p>
        <a
          className="inline-flex items-center gap-3 whitespace-nowrap text-lg leading-normal text-code-accent no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-code-accent"
          href="/cadastro"
        >
          Crie seu cadastro!
          <span
            className="relative size-[18px] rounded border-2 border-code-accent before:absolute before:inset-x-1 before:top-1.5 before:h-0.5 before:bg-code-accent after:absolute after:-bottom-2 after:left-1 after:right-1 after:h-0.5 after:bg-code-accent"
            aria-hidden="true"
          ></span>
        </a>
      </div>
    </form>
  )
}

export default LoginForm
