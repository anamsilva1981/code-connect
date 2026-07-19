import PostActions from '../molecules/PostActions'
import PostTags from '../molecules/PostTags'
import PostThumbnail from '../molecules/PostThumbnail'

function PostCard({ activeTag, isLoggedIn, onAuthRequired, onPostChange, onSelectTag, post }) {
  return (
    <article className="grid overflow-hidden rounded-lg bg-code-panel">
      <a className="block" href={`/posts/${post.id}`}>
        <PostThumbnail alt="" className="h-60 rounded-t-lg" src={post.thumbnailUrl} />
      </a>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2 text-code-gray-light">
          <a className="text-lg font-semibold text-code-gray-light no-underline hover:text-code-accent" href={`/posts/${post.id}`}>
            {post.title}
          </a>
          <p className="m-0 line-clamp-3 text-sm leading-normal">{post.summary}</p>
        </div>

        <PostTags activeTag={activeTag} onSelectTag={onSelectTag} tags={post.tags} />

        <div className="flex items-center justify-between gap-4">
          <PostActions
            isLoggedIn={isLoggedIn}
            onAuthRequired={onAuthRequired}
            onPostChange={onPostChange}
            post={post}
          />

          <div className="flex items-center gap-2 text-sm font-semibold text-code-field">
            <span className="grid size-8 place-items-center rounded-full bg-code-petroleum text-code-accent">
              {post.author.name.slice(0, 1).toUpperCase()}
            </span>
            <span>@{post.author.name.split(' ')[0].toLowerCase()}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard
