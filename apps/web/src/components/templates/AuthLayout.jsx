function AuthLayout({
  bannerAlt,
  bannerHeight,
  bannerSources = [],
  bannerSrc,
  bannerWidth,
  children,
}) {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-code-graphite p-6 text-code-offwhite max-[760px]:block max-[760px]:p-4">
      <div
        className="pointer-events-none fixed -top-20 left-20 h-[487px] w-[407px] rotate-90 rounded-[96px] border-[31px] border-code-petroleum/30 max-[760px]:hidden"
        aria-hidden="true"
      ></div>
      <div
        className="pointer-events-none fixed -right-16 -bottom-32 h-[487px] w-[407px] rotate-90 rounded-[96px] border-[31px] border-code-petroleum/30 max-[760px]:hidden"
        aria-hidden="true"
      ></div>

      <section
        className="relative z-10 grid w-full max-w-[996px] grid-cols-[407px_minmax(0,410px)] items-start justify-between gap-[23px] rounded-[32px] border border-black bg-code-panel px-[78px] py-14 max-[1080px]:max-w-[760px] max-[1080px]:grid-cols-[minmax(260px,1fr)_minmax(0,1fr)] max-[1080px]:gap-12 max-[1080px]:p-11 max-[760px]:w-[min(280px,calc(100vw-32px))] max-[760px]:max-w-[calc(100vw-32px)] max-[760px]:grid-cols-1 max-[760px]:gap-8 max-[760px]:rounded-3xl max-[760px]:p-6 max-[480px]:p-[18px]"
        aria-label="Autenticação"
      >
        <div className="min-w-0">
          <picture>
            {bannerSources.map((source) => (
              <source key={source.srcSet} {...source} />
            ))}
            <img
              className="block h-[675px] w-full object-cover max-[1080px]:h-[560px] max-[760px]:h-auto max-[760px]:max-h-[420px] max-[760px]:object-top"
              src={bannerSrc}
              alt={bannerAlt}
              width={bannerWidth}
              height={bannerHeight}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        <div className="min-w-0 max-[760px]:w-full">{children}</div>
      </section>
    </main>
  )
}

export default AuthLayout
