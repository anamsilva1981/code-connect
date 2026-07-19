const PLACEHOLDER_SRC = '/feed/placeholder-desktop.png'

function PostThumbnail({ alt, className = '', src }) {
  const handleError = (event) => {
    event.currentTarget.src = PLACEHOLDER_SRC
  }

  return (
    <div
      className={`bg-code-field p-4 ${className}`}
      aria-label={src ? undefined : 'Imagem indisponivel'}
    >
      <img
        alt={alt}
        className="h-full w-full rounded-lg object-cover shadow-[0_16px_24px_rgba(0,0,0,0.24)]"
        onError={handleError}
        src={src || PLACEHOLDER_SRC}
      />
    </div>
  )
}

export default PostThumbnail
