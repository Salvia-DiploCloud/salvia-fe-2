import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    label: "Create User",
    description: "Add a new doctor, patient, or admin account",
    href: "/admin/users",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" />
      </svg>
    ),
  },
  {
    label: "View Logs",
    description: "Review audit logs and system events",
    href: "/admin/logs",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Manage Availability",
    description: "Configure doctor schedules and time slots",
    href: "/admin/appointments",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export function AdminQuickActions() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            asChild
            className="h-auto py-4 px-4 justify-start rounded-xl border-border/60 hover:bg-accent/60"
          >
            <Link href={action.href} className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                {action.icon}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium text-foreground">{action.label}</span>
                <span className="text-xs text-muted-foreground font-normal">{action.description}</span>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
