"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const calendarDays = [
  { day: 9, hasAppointments: false },
  { day: 10, hasAppointments: true, count: 2 },
  { day: 11, hasAppointments: true, count: 4 },
  { day: 12, hasAppointments: false },
  { day: 13, hasAppointments: true, count: 1 },
  { day: 14, hasAppointments: false },
  { day: 15, hasAppointments: false },
  { day: 16, hasAppointments: true, count: 6, isToday: true },
  { day: 17, hasAppointments: true, count: 3 },
  { day: 18, hasAppointments: true, count: 5 },
  { day: 19, hasAppointments: true, count: 2 },
  { day: 20, hasAppointments: true, count: 4 },
  { day: 21, hasAppointments: false },
  { day: 22, hasAppointments: false },
]

export function DoctorCalendarPreview() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Week Overview</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs">
          Full calendar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Month label */}
          <p className="text-sm font-medium text-muted-foreground">February 2026</p>

          {/* Week grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Day headers */}
            {weekDays.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground pb-1">
                {d}
              </div>
            ))}

            {/* Week 1 */}
            {calendarDays.slice(0, 7).map((item) => (
              <button
                key={item.day}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors ${
                  item.isToday
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <span className={`text-sm font-semibold ${item.isToday ? "text-primary-foreground" : "text-foreground"}`}>
                  {item.day}
                </span>
                {item.hasAppointments && (
                  <span className={`text-[9px] font-medium ${item.isToday ? "text-primary-foreground/80" : "text-primary"}`}>
                    {item.count} apt
                  </span>
                )}
              </button>
            ))}

            {/* Week 2 */}
            {calendarDays.slice(7).map((item) => (
              <button
                key={item.day}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors ${
                  item.isToday
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <span className={`text-sm font-semibold ${item.isToday ? "text-primary-foreground" : "text-foreground"}`}>
                  {item.day}
                </span>
                {item.hasAppointments && (
                  <span className={`text-[9px] font-medium ${item.isToday ? "text-primary-foreground/80" : "text-primary"}`}>
                    {item.count} apt
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Today summary */}
          <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/10 p-3 mt-1">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground">Today</span>
            </div>
            <Badge variant="secondary" className="text-xs rounded-full">
              6 appointments
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
