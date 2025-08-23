// src/components/RiskBadge.tsx
export default function RiskBadge({ level }: { level: "Low"|"Medium"|"High" }) {
  const map = {
    Low:    "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    High:   "bg-red-100 text-red-800"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${map[level]}`}>{level} risk</span>;
}
