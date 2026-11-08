import Link from "next/link";
import { Badge, Card } from "@/components/common";
import { cn } from "@/_lib/cn";

export function SectionTitle({ children, href, linkLabel = "전체 보기" }: { children: React.ReactNode; href?: string; linkLabel?: string }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-medium">{children}</h2>{href && <Link href={href} className="text-xs text-muted">{linkLabel} <span aria-hidden="true">›</span></Link>}</div>;
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return <div className={cn("h-1.5 overflow-hidden rounded-full bg-line", className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
    <span className="block h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
  </div>;
}

export function CourseTile({ title, meta, price, href = "/learner/explore", className, instructor, stats, thumbnailUrl }: { title: string; meta: string; price?: string; href?: string; className?: string; instructor?: string; stats?: string; thumbnailUrl?: string | null }) {
  return <Link href={href} className={cn("block", className)}><Card padding="none" className="overflow-hidden border border-line bg-card">
    <div className="flex h-[112px] items-end bg-[linear-gradient(135deg,#252b37,#17191d_70%)] bg-cover bg-center p-3" style={thumbnailUrl ? { backgroundImage: `linear-gradient(180deg,transparent 45%,rgba(0,0,0,.55)), url("${thumbnailUrl}")` } : undefined}><span className="rounded-full bg-black/35 px-2.5 py-1 text-[10px] text-text-sub">{meta}</span></div>
    <div className="p-3.5"><h3 className="text-sm font-medium leading-5">{title}</h3>{(instructor || stats) && <p className="mt-1.5 text-[11px] text-muted">{instructor}{instructor && stats ? " · " : ""}{stats}</p>}{price && <p className="mt-2 text-xs font-medium">{price}</p>}</div>
  </Card></Link>;
}

export function Stat({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return <div className="flex-1 rounded-[4px] border border-line bg-panel px-3 py-3"><div className="flex items-center gap-1"><p className="text-[10px] text-muted">{label}</p>{tooltip && <span className="group relative inline-flex"><button type="button" aria-label={`${label}: ${tooltip}`} title={tooltip} className="flex size-4 items-center justify-center rounded-full text-[10px] leading-none text-muted outline-none ring-accent focus-visible:ring-1">ⓘ</button><span role="tooltip" className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-max max-w-[180px] rounded border border-line bg-text px-2 py-1.5 text-left text-[10px] leading-4 text-bg opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{tooltip}</span></span>}</div><p className="mt-1.5 text-base font-medium tabular-nums">{value}</p></div>;
}

export function SmallBadge({ children }: { children: React.ReactNode }) {
  return <Badge color="#9DB8FF" bg="#1A2130">{children}</Badge>;
}
