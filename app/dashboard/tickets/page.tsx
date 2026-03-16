"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TicketStatus = "Open" | "In Progress" | "Resolved"

type Ticket = {
  id: string
  subject: string
  status: TicketStatus
  statusColor: string
  date: string
  lastMessage: string
}

const tickets: Ticket[] = [
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
  {
    id: "TK-1026",
    subject: "Appointment reschedule",
    status: "Open",
    statusColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    date: "Feb 2, 2026",
    lastMessage: "Request received, pending scheduling confirmation.",
  },
]

export default function TicketsPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter((t) => {
      const matchesQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "All" || t.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Tickets
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your requests and messages with the care team.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            All tickets
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by id, subject, message..."
              className="h-10 w-full sm:w-72"
            />
            <div className="flex gap-2">
              {(["All", "Open", "In Progress", "Resolved"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[140px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-accent/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {ticket.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {ticket.subject}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.lastMessage}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] rounded-full px-2 py-0 ${ticket.statusColor}`}
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ticket.date}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No tickets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

