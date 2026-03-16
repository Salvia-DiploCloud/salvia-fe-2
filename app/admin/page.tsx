import { AdminSummaryCards } from "@/components/admin-summary-cards"
import { AdminActivityTable } from "@/components/admin-activity-table"
import { AdminQuickActions } from "@/components/admin-quick-actions"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          {"Administration Panel"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {"System overview and management tools for SALVIA."}
        </p>
      </div>

      {/* Summary cards */}
      <AdminSummaryCards />

      {/* Activity table + Quick actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminActivityTable />
        </div>
        <div className="lg:col-span-1">
          <AdminQuickActions />
        </div>
      </div>
    </div>
  )
}
