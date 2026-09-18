import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "./Auth";
import AuthLayout from "../../components/ui/AuthLayout";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object({
  password: yup.string().trim().min(4, "Your password is too short!").required("Please enter a new password"),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Please confirm your new password"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async (values) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await resetPassword(token, values.password);
      if (res?.success) {
        setDone(true);
        setStatus({ type: "success", message: res.message || "Your password has been reset." });
        setTimeout(() => navigate("/loginform"), 2500);
      } else {
        setStatus({
          type: "error",
          message: res?.message || res?.error || "That reset link is invalid or has expired.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout eyebrow="Account recovery" title="This reset link looks incomplete.">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-card">
          <p className="text-sm text-ink-600">
            We couldn&rsquo;t find a reset token in this link. Request a new one below.
          </p>
          <Link
            to="/forgotpassword"
            className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Set a new password</title>
        <meta name="description" content="Choose a new password for your Linkpii account." />
      </Helmet>
      <AuthLayout
        eyebrow="Account recovery"
        title="Choose a new password."
        subtitle="Pick something you haven't used before on Linkpii."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Set a new password</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">
          Your new password must be at least 4 characters long.
        </p>

        {status && (
          <div
            role="alert"
            className={`mb-4 rounded-xl p-3 text-center text-sm text-white ${
              status.type === "error" ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {status.message}
            {status.type === "error" && (
              <div className="mt-2">
                <Link to="/forgotpassword" className="underline">
                  Request a new link
                </Link>
              </div>
            )}
          </div>
        )}

        {!done && (
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleReset}>
            {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="password">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-ink-400 hover:text-ink-600"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="confirmPassword">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    onChange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl bg-brand-600 p-3 text-lg font-semibold text-white transition-colors hover:bg-brand-700 ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save new password"}
                </button>
              </form>
            )}
          </Formik>
        )}

        {done && (
          <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-card">
            <p className="text-sm text-ink-600">Redirecting you to log in&hellip;</p>
          </div>
        )}
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
