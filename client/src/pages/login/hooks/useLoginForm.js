import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "../login.schema";
import { ROUTES } from "@/routes/constants";

/**
 * Manage login validation, password visibility, submit state, and navigation after sign-in.
 */
export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted, isSubmitting: pending },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const [visible, setVisible] = useState(false);
  const [dialog, setDialog] = useState("");

  const submitting = useRef(false);

  /**
   * Switch the password field between visible and hidden text.
   */
  function togglePasswordVisibility() {
    setVisible((previous) => !previous);
  }

  /**
   * Validate and submit credentials once at a time, then open the dashboard after success.
   */
  async function submitLogin(event) {
    // Block repeated submits immediately, before React updates the button state.
    if (submitting.current) {
      event.preventDefault();
      return;
    }

    submitting.current = true;

    try {
      await handleSubmit(async (values) => {
        try {
          await login({ email: values.email, password: values.password });
          toast.success("Login successful", { id: "login-feedback" });
          navigate(ROUTES.DASHBOARD, { replace: true });
        } catch {
          // The API interceptor displays request errors.
        }
      })(event);
    } finally {
      submitting.current = false;
    }
  }

  return {
    register,
    errors,
    touchedFields,
    isSubmitted,
    visible,
    pending,
    dialog,
    setDialog,
    togglePasswordVisibility,
    handleSubmit: submitLogin,
  };
}

export default useLoginForm;
