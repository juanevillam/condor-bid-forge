import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Condor AI</h1>
          <p className="text-sm text-muted-foreground">Bid Proponent</p>
        </div>

        {/* Auth Card */}
        <Card className="rounded-2xl shadow-elegant">
          <CardHeader className="space-y-1 text-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Condor AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}