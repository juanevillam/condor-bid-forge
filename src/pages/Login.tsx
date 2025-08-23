import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/components/layout/auth-layout";
import { GoogleLogo, MicrosoftLogo } from "@/components/ui/brand-logos";

// TODO: Demo credentials are prefilled for development only - must not ship to production
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@condorai.us");
  const [password, setPassword] = useState("test123");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Check if using demo credentials for instant login
      if (email === "test@condorai.us" && password === "test123") {
        // Demo login - instant redirect
        navigate("/app");
      } else {
        // Mock login with user-edited credentials - just navigate to main app
        navigate("/app");
      }
    }
  };

  const handleSocialLogin = () => {
    // Mock social login - just navigate to main app
    navigate("/app");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-3">
        Demo creds prefilled: test@condorai.us / test123
      </p>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleSocialLogin}
            className="w-full hover:bg-accent/50"
          >
            <GoogleLogo className="mr-2" size={16} />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={handleSocialLogin}
            className="w-full hover:bg-accent/50"
          >
            <MicrosoftLogo className="mr-2" size={16} />
            Microsoft
          </Button>
        </div>
      </div>

      <div className="text-center space-y-2">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}