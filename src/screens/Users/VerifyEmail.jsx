import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { verifyEmail } from "./Auth";
import AuthLayout from "../../components/ui/AuthLayout";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState({ state: "loading", message: "" });

  useEffect(() => {
    if (!token) {
      setStatus({ state: "error", message: "This verification link looks incomplete." });
      return;
    }

    let isMounted = true;

    const run = async () => {
      const res = await verifyEmail(token);
      if (!isMounted) return;

      if (res?.success) {
        setStatus({ state: "success", message: res.message || "Your email has been verified." });
      } else {
        setStatus({
          state: "error",
          message: res?.message || res?.error || "This verification link is invalid or has expired.",
        });
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Verify your email</title>
        <meta name="description" content="Confirm your email address for your Linkpii account." />
      </Helmet>
      <AuthLayout
        eyebrow="Account verification"
        title="Confirming your email."
        subtitle="This only takes a moment."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Email verification</h1>

        <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-card">
          {status.state === "loading" && <p className="text-sm text-ink-600">Verifying your email&hellip;</p>}

          {status.state === "success" && (
            <>
              <p className="text-sm font-semibold text-green-600">{status.message}</p>
              <Link
                to="/loginform"
                className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Go to login
              </Link>
            </>
          )}

          {status.state === "error" && (
            <>
              <p className="text-sm font-semibold text-red-500">{status.message}</p>
              <p className="mt-2 text-sm text-ink-500">
                You can still use your account &mdash; if you need a new verification link, contact support or try
                signing up again with the same email once it expires.
              </p>
              <Link to="/loginform" className="mt-4 inline-block text-sm font-semibold text-brand-700 underline">
                Back to login
              </Link>
            </>
          )}
        </div>
      </AuthLayout>
    </>
  );
};

export default VerifyEmail;
