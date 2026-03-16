import { Card, CardContent } from "@/components/ui/card"

const summaryData = [
  {
    label: "Total Users",
    value: "1,248",
    trend: "+32 this month",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Active Appointments",
    value: "87",
    trend: "12 today",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Open Tickets",
    value: "34",
    trend: "8 high priority",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M15 5v2" />
        <path d="M15 11v2" />
        <path d="M15 17v2" />
        <path d="M5 5a2 2 0 0 0-2 2v3c1.1 0 2 .9 2 2s-.9 2-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
      </svg>
    ),
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "System Alerts",
    value: "5",
    trend: "2 critical",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </svg>
    ),
    color: "bg-red-500/10 text-red-600",
  },
]

export function AdminSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <Card key={item.label} className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-start gap-4 pt-5 pb-5">
            <div className={`flex items-center justify-center size-11 rounded-xl shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs text-muted-foreground font-medium truncate">{item.label}</span>
              <span className="text-2xl font-bold text-foreground leading-tight">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
