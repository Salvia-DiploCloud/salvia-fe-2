import { Card, CardContent } from "@/components/ui/card"

const summaryData = [
  {
    label: "Upcoming Appointments",
    value: "3",
    trend: "+1 this week",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Open Tickets",
    value: "2",
    trend: "1 pending review",
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
    label: "Notifications",
    value: "5",
    trend: "2 unread",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    label: "Uploaded Documents",
    value: "12",
    trend: "Last: Feb 10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
    color: "bg-emerald-500/10 text-emerald-600",
  },
]

export function DashboardSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
