"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const specialties = [
  { value: "general", label: "General Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "ophthalmology", label: "Ophthalmology" },
]

const doctorsBySpecialty: Record<string, { value: string; label: string; available: string[] }[]> = {
  general: [
    { value: "dr-gomez", label: "Dr. Laura Gomez", available: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    { value: "dr-rios", label: "Dr. Carlos Rios", available: ["08:00", "09:00", "10:30", "13:00", "14:30"] },
  ],
  cardiology: [
    { value: "dr-mendez", label: "Dr. Ana Mendez", available: ["08:00", "09:30", "11:00", "14:00", "16:00"] },
    { value: "dr-paredes", label: "Dr. Felipe Paredes", available: ["09:00", "10:00", "11:30", "15:00"] },
  ],
  dermatology: [
    { value: "dr-silva", label: "Dr. Patricia Silva", available: ["08:30", "10:00", "11:30", "14:00", "15:30"] },
  ],
  neurology: [
    { value: "dr-herrera", label: "Dr. Miguel Herrera", available: ["09:00", "10:30", "14:00", "15:30", "17:00"] },
  ],
  pediatrics: [
    { value: "dr-castro", label: "Dr. Maria Castro", available: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"] },
    { value: "dr-leon", label: "Dr. Andres Leon", available: ["09:30", "11:00", "13:30", "15:00"] },
  ],
  orthopedics: [
    { value: "dr-ramos", label: "Dr. Eduardo Ramos", available: ["08:00", "10:00", "12:00", "14:00", "16:00"] },
  ],
  ophthalmology: [
    { value: "dr-vega", label: "Dr. Sofia Vega", available: ["09:00", "10:30", "11:30", "14:00", "15:00", "16:30"] },
  ],
}

const allTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
]

type Errors = {
  specialty?: string
  doctor?: string
  date?: string
  time?: string
  reason?: string
}

export function ScheduleAppointmentForm() {
  const [specialty, setSpecialty] = useState("")
  const [doctor, setDoctor] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const availableDoctors = useMemo(() => {
    if (!specialty) return []
    return doctorsBySpecialty[specialty] || []
  }, [specialty])

  const selectedDoctorData = useMemo(() => {
    return availableDoctors.find((d) => d.value === doctor)
  }, [availableDoctors, doctor])

  const availableSlots = useMemo(() => {
    if (!selectedDoctorData) return []
    return selectedDoctorData.available
  }, [selectedDoctorData])

  function handleSpecialtyChange(value: string) {
    setSpecialty(value)
    setDoctor("")
    setTime("")
    setErrors((prev) => ({ ...prev, specialty: undefined, doctor: undefined, time: undefined }))
  }

  function handleDoctorChange(value: string) {
    setDoctor(value)
    setTime("")
    setErrors((prev) => ({ ...prev, doctor: undefined, time: undefined }))
  }

  function handleDateChange(value: Date | undefined) {
    setDate(value)
    setErrors((prev) => ({ ...prev, date: undefined }))
  }

  function handleTimeSelect(slot: string) {
    setTime(slot)
    setErrors((prev) => ({ ...prev, time: undefined }))
  }

  function validate(): Errors {
    const errs: Errors = {}
    if (!specialty) errs.specialty = "Please select a specialty"
    if (!doctor) errs.doctor = "Please select a doctor"
    if (!date) errs.date = "Please select a date"
    if (!time) errs.time = "Please select a time slot"
    if (!reason.trim()) errs.reason = "Please describe the reason for your visit"
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setShowSuccess(true)
      }, 1500)
    }
  }

  function handleReset() {
    setSpecialty("")
    setDoctor("")
    setDate(undefined)
    setTime("")
    setReason("")
    setErrors({})
    setShowSuccess(false)
  }

  const disabledDays = { before: new Date() }

  const selectedDoctorLabel = selectedDoctorData?.label || ""
  const selectedSpecialtyLabel = specialties.find((s) => s.value === specialty)?.label || ""
  const formattedDate = date
    ? date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : ""

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Step 1: Specialty & Doctor */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary" aria-hidden="true">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <rect width="20" height="14" x="2" y="6" rx="2" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Specialty & Doctor</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Choose your medical specialty and preferred doctor</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {/* Specialty */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="specialty" className="text-sm font-medium text-foreground">Specialty</Label>
              <Select value={specialty} onValueChange={handleSpecialtyChange}>
                <SelectTrigger
                  id="specialty"
                  className={cn(
                    "w-full h-10 rounded-xl",
                    errors.specialty && "border-destructive ring-destructive/20 ring-[3px]"
                  )}
                  aria-invalid={!!errors.specialty}
                >
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-xs text-destructive">{errors.specialty}</p>
              )}
            </div>

            {/* Doctor */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor" className="text-sm font-medium text-foreground">Doctor</Label>
              <Select value={doctor} onValueChange={handleDoctorChange} disabled={!specialty}>
                <SelectTrigger
                  id="doctor"
                  className={cn(
                    "w-full h-10 rounded-xl",
                    errors.doctor && "border-destructive ring-destructive/20 ring-[3px]"
                  )}
                  aria-invalid={!!errors.doctor}
                >
                  <SelectValue placeholder={specialty ? "Select a doctor" : "Select a specialty first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctor && (
                <p className="text-xs text-destructive">{errors.doctor}</p>
              )}
              {selectedDoctorData && (
                <p className="text-xs text-muted-foreground">
                  {selectedDoctorData.available.length} time slots available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Date & Time */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary" aria-hidden="true">
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Date & Time</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Pick a date and an available time slot</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Calendar */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">Date</Label>
                <div className={cn(
                  "rounded-xl border p-1 w-fit",
                  errors.date ? "border-destructive ring-destructive/20 ring-[3px]" : "border-border"
                )}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    disabled={disabledDays}
                  />
                </div>
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date}</p>
                )}
              </div>

              {/* Time slot grid */}
              <div className="flex flex-col gap-2 flex-1">
                <Label className="text-sm font-medium text-foreground">Time Slot</Label>
                {!doctor ? (
                  <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">Select a doctor to view available slots</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {allTimeSlots.map((slot) => {
                      const isAvailable = availableSlots.includes(slot)
                      const isSelected = time === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleTimeSelect(slot)}
                          className={cn(
                            "h-10 rounded-xl text-sm font-medium transition-colors border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : isAvailable
                                ? "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                                : "bg-muted/40 text-muted-foreground/40 border-transparent cursor-not-allowed"
                          )}
                          aria-pressed={isSelected}
                          aria-disabled={!isAvailable}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                )}
                {errors.time && (
                  <p className="text-xs text-destructive">{errors.time}</p>
                )}
                {doctor && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-primary" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full border border-border bg-card" />
                      Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-muted/40" />
                      Unavailable
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Reason */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary" aria-hidden="true">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Reason for Visit</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Briefly describe your symptoms or reason</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setErrors((prev) => ({ ...prev, reason: undefined }))
                }}
                placeholder="Describe your symptoms or reason for the appointment..."
                className={cn(
                  "min-h-28 rounded-xl resize-none",
                  errors.reason && "border-destructive ring-destructive/20 ring-[3px]"
                )}
                aria-invalid={!!errors.reason}
              />
              {errors.reason && (
                <p className="text-xs text-destructive">{errors.reason}</p>
              )}
              <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Preview */}
        {specialty && doctor && date && time && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Appointment Preview</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-1">
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Specialty:</span> {selectedSpecialtyLabel}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Doctor:</span> {selectedDoctorLabel}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Date:</span> {formattedDate}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Time:</span> {time}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl px-6"
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-xl px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Scheduling...
              </span>
            ) : (
              "Confirm Appointment"
            )}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader className="items-center text-center gap-3">
            <div className="flex items-center justify-center size-14 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-green-600" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <DialogTitle className="text-lg font-semibold text-foreground">Appointment Confirmed</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your appointment has been successfully scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Specialty</span>
              <span className="font-medium text-foreground">{selectedSpecialtyLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Doctor</span>
              <span className="font-medium text-foreground">{selectedDoctorLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">{time}</span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full rounded-xl"
              onClick={handleReset}
            >
              Schedule Another
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setShowSuccess(false)}
            >
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
