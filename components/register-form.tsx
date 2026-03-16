"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpUser } from "@/lib/cognito"

type FormErrors = {
  fullName?: string
  idDocument?: string
  birthdate?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password)

  const label = strength <= 1 ? "Weak" : strength <= 3 ? "Medium" : "Strong"

  const color =
    strength <= 1
      ? "bg-destructive"
      : strength <= 3
        ? "bg-amber-500"
        : "bg-emerald-500"

  const textColor =
    strength <= 1
      ? "text-destructive"
      : strength <= 3
        ? "text-amber-600"
        : "text-emerald-600"

  if (!password) return null

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${textColor}`}>
        {"Password strength: "}
        {label}
      </p>
    </div>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [idDocument, setIdDocument] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  function clearError(field: keyof FormErrors) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {}
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!idDocument.trim()) {
      newErrors.idDocument = "ID document is required"
    }
    if (!birthdate) {
      newErrors.birthdate = "Birthdate is required"
    }
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    } else if (passwordStrength <= 1) {
      newErrors.password = "Password is too weak"
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setErrors((prev) => ({ ...prev, form: undefined }))

    try {
      await signUpUser({
        email,
        password,
        attributes: {
          name: fullName,
          birthdate,
          // Si configuras este atributo custom en Cognito, puedes descomentar la siguiente línea:
          // "custom:idDocument": idDocument,
        },
      })
      router.push(`/confirm?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      const message = error?.message || "Unable to create account. Please try again."
      setErrors((prev) => ({ ...prev, form: message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              clearError("fullName")
            }}
            className="pl-10 h-11"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
        </div>
        {errors.fullName && (
          <p id="fullName-error" className="text-sm text-destructive">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* ID Document */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="idDocument">ID Document</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="idDocument"
            type="text"
            placeholder="1234567890"
            value={idDocument}
            onChange={(e) => {
              setIdDocument(e.target.value)
              clearError("idDocument")
            }}
            className="pl-10 h-11"
            aria-invalid={!!errors.idDocument}
            aria-describedby={errors.idDocument ? "idDocument-error" : undefined}
          />
        </div>
        {errors.idDocument && (
          <p id="idDocument-error" className="text-sm text-destructive">
            {errors.idDocument}
          </p>
        )}
      </div>

      {/* Birthdate */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="birthdate">Date of Birth</Label>
        <Input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => {
            setBirthdate(e.target.value)
            clearError("birthdate")
          }}
          className="h-11"
          aria-invalid={!!errors.birthdate}
          aria-describedby={errors.birthdate ? "birthdate-error" : undefined}
        />
        {errors.birthdate && (
          <p id="birthdate-error" className="text-sm text-destructive">
            {errors.birthdate}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="registerEmail">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="registerEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError("email")
            }}
            className="pl-10 h-11"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "registerEmail-error" : undefined}
          />
        </div>
        {errors.email && (
          <p id="registerEmail-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="registerPassword">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="registerPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearError("password")
            }}
            className="pl-10 pr-10 h-11"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "registerPassword-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <PasswordStrengthIndicator password={password} />
        {errors.password && (
          <p id="registerPassword-error" className="text-sm text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              clearError("confirmPassword")
            }}
            className="pl-10 pr-10 h-11"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-destructive">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Form error */}
      {errors.form && (
        <p className="text-sm text-destructive" role="alert">
          {errors.form}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full h-11 text-base mt-1" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      {/* Back to Login */}
      <p className="text-center text-sm text-muted-foreground">
        {"Already have an account? "}
        <a
          href="/"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Back to Login
        </a>
      </p>
    </form>
  )
}
