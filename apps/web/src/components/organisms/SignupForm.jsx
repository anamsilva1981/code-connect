import { useState } from 'react'
import AuthButton from '../atoms/AuthButton'
import AuthCheckbox from '../atoms/AuthCheckbox'
import AuthInput from '../atoms/AuthInput'
import AuthDivider from '../molecules/AuthDivider'
import SocialLoginOption from '../molecules/SocialLoginOption'
import {
  clearSession,
  getAuthErrorMessage,
  getStoredSession,
  register,
  saveSession,
} from '../../services/authApi'

function SignupForm() {
  const [session, setSession] = useState(() => getStoredSession())
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const user = await register({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      })
      const nextSession = {
        accessToken: null,
        user,
      }

      saveSession(nextSession)
      setSession(nextSession)
    } catch (error) {
      setErrorMessage(
        getAuthErrorMessage(error, 'Nao foi possivel criar sua conta. Tente novamente.'),
      )
    } finally {
      setIsSubmitting(false)
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
            Cadastro
          </h1>
          <p className="m-0 text-xl leading-normal text-code-offwhite">
            Cadastro criado com sucesso.
          </p>
        </div>

        <div className="grid gap-2 rounded-lg bg-code-field/20 p-4 text-code-offwhite">
          <strong className="text-lg">{session.user.name}</strong>
          <span className="text-sm">{session.user.email}</span>
        </div>

        <p className="m-0 text-sm leading-normal text-code-offwhite">
          Faca login para emitir um token de acesso.
        </p>

        <a
          className="inline-flex items-center justify-center rounded-lg bg-code-accent px-4 py-3 text-lg font-semibold text-code-petroleum no-underline transition hover:-translate-y-px hover:bg-code-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-code-accent"
          href="/login"
        >
          Fazer login
        </a>

        <AuthButton onClick={handleLogout} type="button">
          Limpar cadastro salvo
        </AuthButton>
      </section>
    )
  }

  return (
    <form className="grid w-full gap-6 text-left text-code-offwhite" onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <h1 className="m-0 text-3xl font-semibold leading-normal text-code-offwhite">
          Cadastro
        </h1>
        <p className="m-0 text-xl leading-normal text-code-offwhite">
          Olá! Preencha seus dados.
        </p>
      </div>

      <div className="grid gap-4">
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

      <div className="-mt-4 flex items-center justify-between gap-4 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2.5">
        <AuthCheckbox defaultChecked id="signup-remember" label="Lembrar-me" name="remember" />
      </div>

      {errorMessage ? (
        <p className="m-0 rounded bg-red-950/70 p-3 text-sm text-code-offwhite" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <AuthButton type="submit">
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        <span aria-hidden="true">-&gt;</span>
      </AuthButton>

      <AuthDivider>ou entre com outras contas</AuthDivider>

      <div className="flex justify-center gap-6">
        <SocialLoginOption label="Github" logoSrc="/github.png" />
        <SocialLoginOption label="Gmail" logoSrc="/google.png" />
      </div>

      <div className="flex items-center gap-2 max-[760px]:flex-col max-[760px]:items-start">
        <p className="m-0 whitespace-nowrap text-lg leading-normal text-code-offwhite">
          Já tem conta?
        </p>
        <a
          className="inline-flex items-center gap-3 whitespace-nowrap text-lg leading-normal text-code-accent no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-code-accent"
          href="/login"
        >
          Faça seu login!
          <span
            className="relative size-[18px] rounded border-2 border-code-accent before:absolute before:top-2 before:-left-2 before:h-0.5 before:w-2 before:bg-code-accent after:absolute after:top-1 after:-left-0.5 after:size-2 after:rotate-45 after:border-t-2 after:border-r-2 after:border-code-accent"
            aria-hidden="true"
          ></span>
        </a>
      </div>
    </form>
  )
}

export default SignupForm
