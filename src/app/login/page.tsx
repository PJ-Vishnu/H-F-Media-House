import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Logo />
            <p className="text-muted-foreground mt-2">Admin Panel Login</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
