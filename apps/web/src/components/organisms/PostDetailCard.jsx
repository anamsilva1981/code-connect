import PostActions from '../molecules/PostActions'
import PostTags from '../molecules/PostTags'
import PostThumbnail from '../molecules/PostThumbnail'

function PostDetailCard({ isLoggedIn, onAuthRequired, onPostChange, post }) {
  return (
    <article className="grid overflow-hidden rounded-lg bg-code-panel">
      <PostThumbnail alt="" className="h-80 rounded-t-lg" src={post.thumbnailUrl} />

      <div className="grid gap-5 p-4">
        <div className="grid gap-2 text-code-gray-light">
          <h1 className="m-0 text-2xl font-semibold leading-normal">{post.title}</h1>
          <p className="m-0 text-sm leading-normal">{post.summary}</p>
          <p className="m-0 whitespace-pre-wrap text-base leading-normal">{post.content}</p>
        </div>

        <PostTags tags={post.tags} />

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

export default PostDetailCard
