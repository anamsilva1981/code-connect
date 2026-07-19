function CommentList({ comments = [] }) {
  if (!comments.length) {
    return (
      <p className="m-0 rounded bg-code-panel p-4 text-code-gray-light">
        Ainda nao ha comentarios neste post.
      </p>
    )
  }

  return (
    <section className="grid gap-4">
      {comments.map((comment) => (
        <article className="grid gap-2 rounded bg-code-panel p-4" key={comment.id}>
          <div className="flex items-center gap-2 text-sm font-semibold text-code-field">
            <span className="grid size-8 place-items-center rounded-full bg-code-petroleum text-code-accent">
              {comment.author.name.slice(0, 1).toUpperCase()}
            </span>
            <span>@{comment.author.name.split(' ')[0].toLowerCase()}</span>
          </div>
          <p className="m-0 text-code-gray-light">{comment.content}</p>
        </article>
      ))}
    </section>
  )
}

export default CommentList
