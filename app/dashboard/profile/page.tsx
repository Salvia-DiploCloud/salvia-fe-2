"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getCurrentUserProfile, updateCurrentUserAttributes } from "@/lib/cognito"

type FormState = {
  name: string
  email: string
  birthdate: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    birthdate: "",
  })

  const canSave = useMemo(() => {
    if (!form.email) return false
    return true
  }, [form.email])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getCurrentUserProfile()
      .then((profile) => {
        if (!mounted) return
        if (!profile) {
          setError("No authenticated user.")
          return
        }
        setForm({
          name: profile.name ?? "",
          email: profile.email ?? "",
          birthdate: profile.birthdate ?? "",
        })
      })
      .catch((e: any) => {
        if (!mounted) return
        setError(e?.message || "Unable to load profile.")
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!canSave) return

    setIsSaving(true)
    try {
      const attrs: Record<string, string> = {}
      if (form.name.trim()) attrs.name = form.name.trim()
      if (form.birthdate) attrs.birthdate = form.birthdate
      await updateCurrentUserAttributes(attrs)
      setSuccess("Profile updated.")
    } catch (err: any) {
      setError(err?.message || "Unable to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your basic account information.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Personal information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="h-11"
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  className="h-11"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email is managed by Cognito and can’t be edited here.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="birthdate">Date of birth</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => setForm((p) => ({ ...p, birthdate: e.target.value }))}
                  className="h-11"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-600" role="status">
                {success}
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl"
                disabled={loading || isSaving || !canSave}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

