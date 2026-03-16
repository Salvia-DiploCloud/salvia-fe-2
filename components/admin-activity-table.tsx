import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const activityData = [
  {
    id: "ACT-001",
    user: "Dr. Roberto Alvarez",
    action: "Updated patient record",
    target: "Maria Lopez (#P-1042)",
    timestamp: "2 min ago",
    type: "update" as const,
  },
  {
    id: "ACT-002",
    user: "Laura Mendez",
    action: "Created new appointment",
    target: "Appointment #A-3891",
    timestamp: "8 min ago",
    type: "create" as const,
  },
  {
    id: "ACT-003",
    user: "System",
    action: "Backup completed",
    target: "Database backup v2.4",
    timestamp: "15 min ago",
    type: "system" as const,
  },
  {
    id: "ACT-004",
    user: "Dr. Ana Torres",
    action: "Resolved ticket",
    target: "Ticket #T-0782",
    timestamp: "22 min ago",
    type: "update" as const,
  },
  {
    id: "ACT-005",
    user: "Admin Master",
    action: "Deactivated user account",
    target: "Carlos Ruiz (#U-0319)",
    timestamp: "35 min ago",
    type: "delete" as const,
  },
  {
    id: "ACT-006",
    user: "System",
    action: "SSL certificate renewed",
    target: "api.salvia.health",
    timestamp: "1 hour ago",
    type: "system" as const,
  },
  {
    id: "ACT-007",
    user: "Laura Mendez",
    action: "Registered new patient",
    target: "Pedro Sanchez (#P-1043)",
    timestamp: "1 hour ago",
    type: "create" as const,
  },
]

const typeBadge: Record<string, { label: string; className: string }> = {
  create: { label: "Create", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  update: { label: "Update", className: "bg-primary/10 text-primary border-primary/20" },
  delete: { label: "Delete", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  system: { label: "System", className: "bg-muted text-muted-foreground border-border" },
}

export function AdminActivityTable() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Recent System Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="pr-6 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="pl-6 font-medium text-foreground">{row.user}</TableCell>
                <TableCell className="text-muted-foreground">{row.action}</TableCell>
                <TableCell className="text-muted-foreground">{row.target}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeBadge[row.type].className}>
                    {typeBadge[row.type].label}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right text-muted-foreground text-xs">{row.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
