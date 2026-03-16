import { DoctorSidebar } from "@/components/doctor-sidebar"
import { DoctorNavbar } from "@/components/doctor-navbar"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DoctorNavbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
