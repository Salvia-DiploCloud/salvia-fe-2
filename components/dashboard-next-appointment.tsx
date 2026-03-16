import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardNextAppointment() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Next Appointment</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Appointment card */}
        <div className="flex items-start gap-4 rounded-xl bg-primary/5 p-4 border border-primary/10">
          {/* Date block */}
          <div className="flex flex-col items-center justify-center shrink-0 size-14 rounded-xl bg-primary text-primary-foreground">
            <span className="text-lg font-bold leading-tight">18</span>
            <span className="text-[10px] font-medium uppercase leading-tight">Feb</span>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">General Checkup</span>
              <Badge variant="secondary" className="text-[10px] rounded-full px-2 py-0">
                Confirmed
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-6">
                <AvatarFallback className="bg-accent text-accent-foreground text-[10px] font-semibold">
                  DR
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Dr. Roberto Alvarez</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                10:00 AM
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Room 204, Building A
              </span>
            </div>
          </div>
        </div>

        {/* Additional upcoming */}
        <div className="flex items-center gap-4 rounded-xl p-4 border border-border">
          <div className="flex flex-col items-center justify-center shrink-0 size-14 rounded-xl bg-muted text-foreground">
            <span className="text-lg font-bold leading-tight">25</span>
            <span className="text-[10px] font-medium uppercase leading-tight">Feb</span>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-sm text-foreground">Dental Cleaning</span>
            <span className="text-xs text-muted-foreground">Dra. Ana Martinez &middot; 2:30 PM</span>
          </div>
          <Badge variant="outline" className="text-[10px] rounded-full px-2 py-0 shrink-0">
            Scheduled
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
