import SignupForm from '../components/organisms/SignupForm'
import AuthLayout from '../components/templates/AuthLayout'

function SignupPage() {
  return (
    <AuthLayout
      bannerAlt="Pessoa trabalhando em uma interface digital da Code Connect"
      bannerHeight="683"
      bannerSources={[
        {
          sizes: '(max-width: 760px) 244px, (max-width: 1080px) 320px, 407px',
          srcSet: '/signup-banner-320.webp 320w, /signup-banner-407.webp 407w',
          type: 'image/webp',
        },
      ]}
      bannerSrc="/signup-banner.png"
      bannerWidth="407"
    >
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
