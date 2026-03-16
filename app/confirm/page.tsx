"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { confirmSignUp } from "@/lib/cognito"

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialEmail = searchParams.get("email") ?? ""

  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !code) {
      setError("Email and verification code are required.")
      return
    }

    setIsSubmitting(true)
    try {
      await confirmSignUp(email, code)
      setSuccess("Your email has been confirmed. You can now sign in.")
      setTimeout(() => router.push("/"), 1500)
    } catch (err: any) {
      setError(err?.message || "Unable to confirm your account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <main className="w-full max-w-md">
        <Card className="rounded-2xl shadow-lg border-border/60">
          <CardHeader className="items-center text-center gap-3 pb-2">
            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary/5 border border-primary/10 mb-1">
              <Logo size={52} />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                Confirm your email
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Enter the verification code sent to your email address.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmEmail">Email</Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  className="h-11"
                  required
                />
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

              <Button type="submit" size="lg" className="w-full h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Confirming..." : "Confirm email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

