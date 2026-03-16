"use client"

import { useState } from "react"
import { ScheduleAppointmentForm, type Ticket } from "@/components/schedule-appointment-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TicketsPage() {
  const [createdTickets, setCreatedTickets] = useState<Ticket[]>([])

  function handleTicketCreated(ticket: Ticket) {
    setCreatedTickets((prev) => [ticket, ...prev])
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          My Tickets
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new ticket and preview the ones you've created.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Create Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleAppointmentForm onTicketCreated={handleTicketCreated} />
        </CardContent>
      </Card>

      {createdTickets.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Preview of created tickets</h2>
            <span className="text-sm text-muted-foreground">{createdTickets.length} created</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {createdTickets.map((ticket) => (
              <Card key={ticket.id} className="rounded-2xl border-border/60 shadow-sm">
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground">{ticket.category} · {ticket.priority}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">ID</p>
                        <p className="text-xs font-mono text-foreground">{ticket.id}</p>
                      </div>
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

