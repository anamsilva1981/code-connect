import LoginForm from '../components/organisms/LoginForm'
import AuthLayout from '../components/templates/AuthLayout'

function LoginPage() {
  return (
    <AuthLayout
      bannerAlt="Pessoa trabalhando em uma interface digital da Code Connect"
      bannerSrc="/banner.png"
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
