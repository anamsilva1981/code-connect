import AuthButton from '../atoms/AuthButton'
import AuthCheckbox from '../atoms/AuthCheckbox'
import AuthInput from '../atoms/AuthInput'
import AuthDivider from '../molecules/AuthDivider'
import SocialLoginOption from '../molecules/SocialLoginOption'

function LoginForm() {
  return (
    <form className="grid w-full gap-6 text-left text-code-offwhite">
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

      <AuthButton type="submit">
        Login
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
