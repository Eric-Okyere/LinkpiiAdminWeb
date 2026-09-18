import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { forgetPassword } from "./Auth";
import AuthLayout from "../../components/ui/AuthLayout";

const initialValues = {
  email: "",
};

const validationSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email address").required("Please enter your email"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const navigate = useNavigate();

  const handleForgotPassword = async (values, { resetForm }) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await forgetPassword(values.email.trim().toLowerCase());
      if (res?.success) {
        setStatus({
          type: "success",
          message: res.message || "If an account exists for that email, we've sent password reset instructions.",
        });
        resetForm();
      } else {
        setStatus({
          type: "error",
          message: res?.message || res?.error || "We couldn't send a reset link. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot password</title>
        <meta name="description" content="Reset the password for your Linkpii account." />
      </Helmet>
      <AuthLayout
        eyebrow="Account recovery"
        title="Forgot your password? We'll help you get back in."
        subtitle="Enter the email on your account and we'll send you a link to reset it."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Reset password</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">
          We&rsquo;ll email you a link to set a new password.
        </p>

        {status && (
          <div
            role="alert"
            className={`mb-4 rounded-xl p-3 text-center text-sm text-white ${
              status.type === "error" ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {status.message}
          </div>
        )}

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleForgotPassword}>
          {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter the email on your account"
                className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                autoComplete="email"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full rounded-xl bg-brand-600 p-3 text-lg font-semibold text-white transition-colors hover:bg-brand-700 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <div className="mt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/loginform")}
                  className="flex-1 rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signupform")}
                  className="flex-1 rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                >
                  Sign up
                </button>
              </div>
            </form>
          )}
        </Formik>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
