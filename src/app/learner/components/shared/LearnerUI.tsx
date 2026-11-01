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

export function CourseTile({ title, meta, price, href = "/learner/courses/course-1" }: { title: string; meta: string; price?: string; href?: string }) {
  return <Link href={href} className="block"><Card padding="none" className="overflow-hidden border border-line bg-card">
    <div className="flex h-[112px] items-end bg-[linear-gradient(135deg,#252b37,#17191d_70%)] p-3"><span className="rounded-full bg-black/35 px-2.5 py-1 text-[10px] text-text-sub">{meta}</span></div>
    <div className="p-3.5"><h3 className="text-sm font-medium leading-5">{title}</h3><p className="mt-1.5 text-[11px] text-muted">이하늘 · 초급 · 수강생 1,248</p>{price && <p className="mt-2 text-xs font-medium">{price}</p>}</div>
  </Card></Link>;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return <div className="flex-1 rounded-[4px] border border-line bg-panel px-3 py-3"><p className="text-[10px] text-muted">{label}</p><p className="mt-1.5 text-base font-medium tabular-nums">{value}</p></div>;
}

export function SmallBadge({ children }: { children: React.ReactNode }) {
  return <Badge color="#9DB8FF" bg="#1A2130">{children}</Badge>;
}
