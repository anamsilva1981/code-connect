import SignupForm from '../components/organisms/SignupForm'
import AuthLayout from '../components/templates/AuthLayout'

function SignupPage() {
  return (
    <AuthLayout
      bannerAlt="Pessoa trabalhando em uma interface digital da Code Connect"
      bannerSrc="/signup-banner.png"
    >
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
