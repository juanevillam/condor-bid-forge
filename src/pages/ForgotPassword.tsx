import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/auth-layout";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Mock password reset
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If this email exists, we've sent a reset link.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Check your email">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If an account with <strong>{email}</strong> exists, we've sent you a password reset link.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full"
            >
              Try different email
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>

      <div className="text-center">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}