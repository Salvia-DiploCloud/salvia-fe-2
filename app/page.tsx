import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <main className="w-full max-w-md">
        <Card className="rounded-2xl shadow-lg border-border/60">
          <CardHeader className="items-center text-center gap-3 pb-2">
            {/* Logo */}
            <div className="flex items-center justify-center size-20 rounded-2xl bg-primary/5 border border-primary/10 mb-1">
              <Logo size={52} />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                SALVIA
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Salud Digital Conectada
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground">
{"Informaci\u00f3n de salud protegida. Solo acceso autorizado."}
        </p>
      </main>
    </div>
  )
}
