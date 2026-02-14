import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import styles from "./login.module.css";
import { GlassCard } from "~/components/glass-card/glass-card";
import { GradientButton } from "~/components/gradient-button/gradient-button";
import { signInWithEmail, signInWithGoogle, getUser } from "~/lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - MenuFlow" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (user) {
    return redirect("/dashboard");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "google") {
    return await signInWithGoogle(request);
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error, headers } = await signInWithEmail(request, email, password);

  if (error) {
    return { error };
  }

  return redirect("/dashboard", { headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className={styles.container}>
      <GlassCard className={styles.card}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>MenuFlow</h1>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account to continue</p>

        {actionData?.error && (
          <div className={styles.error}>
            {actionData.error}
          </div>
        )}

        <Form className={styles.form} method="post">
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="you@restaurant.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <GradientButton type="submit" style={{ width: "100%" }} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </GradientButton>
        </Form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value="google" />
          <button className={styles.googleButton} type="submit" disabled={isSubmitting}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </Form>

        <div className={styles.footer}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </GlassCard>
    </div>
  );
}
