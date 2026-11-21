import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Brand from "./components/Brand";
import InfoDialog from "@/components/InfoDialog";
import { useLoginForm } from "./hooks/useLoginForm";
import "./Login.css";

export default function Login() {
  const {
    register,
    errors,
    touchedFields,
    isSubmitted,
    visible,
    pending,
    dialog,
    setDialog,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();
  const emailError =
    (touchedFields.email || isSubmitted) && errors.email?.message;
  const passwordError =
    (touchedFields.password || isSubmitted) && errors.password?.message;

  return (
    <main className="auth-shell">
      <Card
        as="section"
        className="login-card border-0"
        aria-labelledby="login-title"
      >
        <Brand />
        <h1 id="login-title">Login to account</h1>
        <p className="subtitle">Enter your email &amp; password/OTP to login</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">
              Email{" "}
              <span className="required-indicator" aria-hidden="true">
                *
              </span>
            </label>
            <Input
              {...register("email")}
              className="login-input"
              id="email"
              type="email"
              placeholder="Enter email"
              autoComplete="username"
              required
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            <p className="field-error" id="email-error" aria-live="polite">
              {emailError || ""}
            </p>
          </div>
          <div className="field-group password-group">
            <label htmlFor="password">
              Password{" "}
              <span className="required-indicator" aria-hidden="true">
                *
              </span>
            </label>
            <div className="password-input">
              <Input
                {...register("password")}
                className="login-input"
                id="password"
                type={visible ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              <Button
                type="button"
                className="visibility-button"
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                onClick={togglePasswordVisibility}
              >
                {visible ? <EyeOff size={13} /> : <Eye size={13} />}
              </Button>
            </div>
            <p className="field-error" id="password-error" aria-live="polite">
              {passwordError || ""}
            </p>
          </div>
          <div className="forgot-row">
            <a
              href="#forgot-password"
              className="text-button"
              aria-haspopup="dialog"
              onClick={(event) => {
                event.preventDefault();
                setDialog("Forgot Password?");
              }}
            >
              Forgot Password?
            </a>
          </div>
          <Button type="submit" className="primary-button" disabled={pending}>
            {pending && <LoaderCircle className="spinner" size={14} />}
            {pending ? "Logging in…" : "Login using Password"}
          </Button>
          <div className="divider">
            <span>OR</span>
          </div>
          <Button
            type="button"
            className="outline-button"
            onClick={() => setDialog("Login using OTP")}
          >
            Login using OTP
          </Button>
        </form>
      </Card>
      {dialog && <InfoDialog title={dialog} onClose={() => setDialog("")} />}
    </main>
  );
}
