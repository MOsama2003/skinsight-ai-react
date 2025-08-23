export default function VideoCarousel({ items }: { items: any[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">Educational videos</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((v:any) => (
          <a key={v.videoId} href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noreferrer"
             className="min-w-[260px] border rounded-xl hover:shadow-md transition-shadow">
            {v.thumbnail && (
              <img src={v.thumbnail} alt={v.title}
                   className="rounded-t-xl w-full aspect-video object-cover border-b" />
            )}
            <div className="p-3">
              <div className="text-sm font-medium line-clamp-2">{v.title}</div>
              <div className="text-xs text-slate-500">{v.channel}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
