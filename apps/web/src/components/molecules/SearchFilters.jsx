function SearchFilters({
  activeTag,
  onClear,
  onSearchChange,
  onSortChange,
  onTagChange,
  search,
  sort,
  tags,
}) {
  return (
    <section className="grid gap-4">
      <label className="flex min-h-12 items-center gap-4 rounded bg-code-panel px-4 py-2 text-code-gray-light">
        <span aria-hidden="true" className="text-2xl">
          search
        </span>
        <input
          className="w-full bg-transparent text-lg text-code-gray-light outline-none placeholder:text-code-gray-light"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Digite o que voce procura"
          type="search"
          value={search}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              className={`rounded px-2 py-1 text-sm text-code-panel transition hover:bg-code-accent ${
                activeTag === tag ? 'bg-code-field' : 'bg-code-gray-light'
              }`}
              key={tag}
              onClick={() => onTagChange(activeTag === tag ? '' : tag)}
              type="button"
            >
              {tag}
              {activeTag === tag ? <span aria-hidden="true"> x</span> : null}
            </button>
          ))}
        </div>

        <button className="text-sm text-code-field hover:text-code-accent" onClick={onClear} type="button">
          Limpar tudo
        </button>
      </div>

      <div className="flex justify-center gap-6 text-lg">
        <button
          className={sort === 'recent' ? 'font-semibold text-code-accent underline' : 'text-code-field'}
          onClick={() => onSortChange('recent')}
          type="button"
        >
          Recentes
        </button>
        <button
          className={sort === 'popular' ? 'font-semibold text-code-accent underline' : 'text-code-field'}
          onClick={() => onSortChange('popular')}
          type="button"
        >
          Populares
        </button>
      </div>
    </section>
  )
}

export default SearchFilters
