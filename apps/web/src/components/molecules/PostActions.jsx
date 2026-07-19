import { likePost, unlikePost } from '../../services/postsApi'

function ActionButton({ children, disabled, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="grid min-w-8 justify-items-center gap-0.5 text-code-field transition hover:text-code-accent disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function PostActions({ isLoggedIn, onAuthRequired, onPostChange, post }) {
  const handleLike = async () => {
    if (!isLoggedIn) {
      onAuthRequired?.('Entre para curtir posts.')
      return
    }

    const nextPost = post.likedByMe ? await unlikePost(post.id) : await likePost(post.id)
    onPostChange?.(nextPost)
  }

  const handleComment = () => {
    if (!isLoggedIn) {
      onAuthRequired?.('Entre para comentar posts.')
    }
  }

  return (
    <div className="flex items-center gap-4 text-code-field">
      <ActionButton label={post.likedByMe ? 'Remover curtida' : 'Curtir'} onClick={handleLike}>
        <span aria-hidden="true" className="text-lg">
          {'<>'}
        </span>
        <span className="text-xs">{post.likesCount}</span>
      </ActionButton>
      <ActionButton disabled label="Compartilhar">
        <span aria-hidden="true" className="text-lg">
          share
        </span>
        <span className="text-xs">0</span>
      </ActionButton>
      <ActionButton label="Comentar" onClick={handleComment}>
        <span aria-hidden="true" className="text-lg">
          chat
        </span>
        <span className="text-xs">{post.commentsCount}</span>
      </ActionButton>
    </div>
  )
}

export default PostActions
