function PostTags({ activeTag = '', onSelectTag, tags = [] }) {
  if (!tags.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {tags.map((tag) => {
        const isActive = activeTag.toLowerCase() === tag.toLowerCase()

        if (!onSelectTag) {
          return (
            <span
              className="rounded bg-code-gray-light px-2 py-1 text-sm text-code-panel"
              key={tag}
            >
              {tag}
            </span>
          )
        }

        return (
          <button
            className={`rounded px-2 py-1 text-sm text-code-panel transition hover:bg-code-accent ${
              isActive ? 'bg-code-field' : 'bg-code-gray-light'
            }`}
            key={tag}
            onClick={() => onSelectTag(isActive ? '' : tag)}
            type="button"
          >
            {tag}
            {isActive ? <span aria-hidden="true"> x</span> : null}
          </button>
        )
      })}
    </div>
  )
}

export default PostTags
