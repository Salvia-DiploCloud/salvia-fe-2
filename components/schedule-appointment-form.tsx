"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getCurrentUserToken } from "@/lib/cognito"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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


type Errors = {
  title?: string
  description?: string
  category?: string
  priority?: string
  form?: string
}

export type TicketPayload = {
  title: string
  description: string
  category: string
  priority: string
}

export type Ticket = TicketPayload & {
  id: string
  createdAt: string
}

export type ScheduleAppointmentFormProps = {
  onTicketCreated?: (ticket: Ticket) => void
}

const ticketCategories = [
  { value: "MEDICAL_REQUEST", label: "Medical Request" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "BILLING", label: "Billing" },
  { value: "OTHER", label: "Other" },
]

const ticketPriorities = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
]

export function ScheduleAppointmentForm({ onTicketCreated }: ScheduleAppointmentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)


  function validate(): Errors {
    const errs: Errors = {}

    if (!title.trim()) errs.title = "Please provide a title for the ticket"
    if (!description.trim()) errs.description = "Please provide a description"
    if (!category) errs.category = "Please select a category"
    if (!priority) errs.priority = "Please select a priority"

    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)

      try {
        const token = await getCurrentUserToken()
        if (!token) throw new Error("No authentication token found. Please sign in again.")

        // Debug: log token so the browser network tab shows it is retrieved
        // (remove this once you confirm it is present in request headers)
        // eslint-disable-next-line no-console
        console.debug("Cognito token:", token)

        const response = await fetch(`/api/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => null)
          throw new Error(error?.message || "Failed to create ticket")
        }

        const data = await response.json().catch(() => null)
        const createdTicket = data?.ticket as Ticket | undefined
        if (createdTicket && onTicketCreated) {
          onTicketCreated(createdTicket)
        }

        setShowSuccess(true)
      } catch (error) {
        setErrors((prev) => ({ ...prev, form: (error as Error).message }))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  function handleReset() {
    setTitle("")
    setDescription("")
    setCategory("")
    setPriority("")
    setErrors({})
    setShowSuccess(false)
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {errors.form && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {errors.form}
          </div>
        )}



        {/* Ticket Details */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary" aria-hidden="true">
                  <path d="M4 4h16v16H4z" />
                  <path d="M8 8h8v8H8z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Ticket Details</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Fill out the ticket information to create a request.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setErrors((prev) => ({ ...prev, title: undefined }))
                  }}
                  placeholder="Request for lab results"
                  className={cn(
                    errors.title && "border-destructive ring-destructive/20 ring-[3px]"
                  )}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-sm font-medium text-foreground">Category</Label>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value)
                  setErrors((prev) => ({ ...prev, category: undefined }))
                }}>
                  <SelectTrigger
                    id="category"
                    className={cn(
                      "w-full h-10 rounded-xl",
                      errors.category && "border-destructive ring-destructive/20 ring-[3px]"
                    )}
                    aria-invalid={!!errors.category}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="priority" className="text-sm font-medium text-foreground">Priority</Label>
                <Select value={priority} onValueChange={(value) => {
                  setPriority(value)
                  setErrors((prev) => ({ ...prev, priority: undefined }))
                }}>
                  <SelectTrigger
                    id="priority"
                    className={cn(
                      "w-full h-10 rounded-xl",
                      errors.priority && "border-destructive ring-destructive/20 ring-[3px]"
                    )}
                    aria-invalid={!!errors.priority}
                  >
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketPriorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-xs text-destructive">{errors.priority}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setErrors((prev) => ({ ...prev, description: undefined }))
                  }}
                  placeholder="I need a copy of my blood test results from January 2026."
                  className={cn(
                    "min-h-28 rounded-xl resize-none",
                    errors.description && "border-destructive ring-destructive/20 ring-[3px]"
                  )}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Preview */}

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
              "Create Ticket"
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
            <DialogTitle className="text-lg font-semibold text-foreground">Ticket Created</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your ticket has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium text-foreground">{title || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{ticketCategories.find((c) => c.value === category)?.label || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority</span>
              <span className="font-medium text-foreground">{ticketPriorities.find((p) => p.value === priority)?.label || "—"}</span>
            </div>
            {description && (
              <div className="text-sm">
                <span className="text-muted-foreground">Description</span>
                <p className="font-medium text-foreground mt-1 break-words">{description}</p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full rounded-xl"
              onClick={handleReset}
            >
              Create Another Ticket
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
