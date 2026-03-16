import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const tickets = [
  {
    id: "TK-1042",
    subject: "Lab results inquiry",
    status: "Open",
    statusColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    date: "Feb 14, 2026",
    lastMessage: "Waiting for doctor review of blood work results.",
  },
  {
    id: "TK-1038",
    subject: "Prescription renewal request",
    status: "In Progress",
    statusColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    date: "Feb 12, 2026",
    lastMessage: "Your request has been forwarded to Dr. Alvarez.",
  },
  {
    id: "TK-1031",
    subject: "Insurance coverage question",
    status: "Resolved",
    statusColor: "bg-muted text-muted-foreground border-border",
    date: "Feb 8, 2026",
    lastMessage: "Your policy covers the procedure. Ticket closed.",
  },
]

export function DashboardLatestTickets() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Latest Tickets</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex flex-col gap-2 rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.id}</span>
                <span className="font-medium text-sm text-foreground truncate">{ticket.subject}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] rounded-full px-2 py-0 shrink-0 ${ticket.statusColor}`}
              >
                {ticket.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{ticket.lastMessage}</p>
            <span className="text-[10px] text-muted-foreground">{ticket.date}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
