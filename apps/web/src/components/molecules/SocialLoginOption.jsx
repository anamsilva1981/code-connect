import AuthButton from '../atoms/AuthButton'
import SocialLogo from '../atoms/SocialLogo'

function SocialLoginOption({ label, logoSrc }) {
  return (
    <AuthButton
      aria-label={`Entrar com ${label}`}
      icon={<SocialLogo alt="" src={logoSrc} />}
      variant="social"
    >
      {label}
    </AuthButton>
  )
}

export default SocialLoginOption
