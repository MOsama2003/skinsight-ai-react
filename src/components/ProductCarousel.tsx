// src/components/ProductCarousel.tsx
export default function ProductCarousel({ items }: { items: any[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">Over-the-counter products</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((p:any) => (
          <a key={p.id} href={p.link} target="_blank" rel="noreferrer"
             className="min-w-[240px] p-4 border rounded-xl hover:shadow-md transition-shadow">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-slate-500 mt-1">For: {p.use}</div>
            <div className="text-xs mt-2">{p.notes}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
