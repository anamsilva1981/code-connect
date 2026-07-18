import LoginForm from '../components/organisms/LoginForm'
import AuthLayout from '../components/templates/AuthLayout'

function LoginPage() {
  return (
    <AuthLayout
      bannerAlt="Pessoa trabalhando em uma interface digital da Code Connect"
      bannerHeight="415"
      bannerSources={[
        {
          sizes: '(max-width: 760px) 244px, (max-width: 1080px) 320px, 407px',
          srcSet: '/banner-320.webp 320w, /banner-528.webp 528w',
          type: 'image/webp',
        },
      ]}
      bannerSrc="/banner.png"
      bannerWidth="528"
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
