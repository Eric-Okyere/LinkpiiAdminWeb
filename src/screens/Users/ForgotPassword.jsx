import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import baseURL from "../../assets/baseURL";
import AuthLayout from "../../components/ui/AuthLayout";

const initialValues = {
  phone: "",
};

const validationSchema = yup.object({
  phone: yup.string().trim().required("Please input your phone number!"),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleForgetPassword = async (value, formikActions) => {
    console.log("Phone number entered:", value.phone);
    try {
      const res = await axios.post(`${baseURL}forgpass`, {
        phone: value.phone,
        usermessage: "Password reset request"
      });

      if (res.data.success) {
        alert("Success: " + res.data.message);
        navigate("/loginform");
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Network error: Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };


  return (
    <>
      <Helmet>
        <title>Reset your password</title>
        <meta name="description" content="Reset the password for your Linkpii account." />
      </Helmet>
      <AuthLayout
        eyebrow="Account recovery"
        title="Forgot your password? We'll help you get back in."
        subtitle="Enter the phone number on your account and we'll send you reset instructions."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Reset password</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">
          We&rsquo;ll text you a way to reset it.
        </p>

        {message.text && (
          <div
            className={`mb-4 rounded-xl p-3 text-center text-sm text-white ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleForgetPassword}>
          {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                placeholder="Please enter your phone number eg. 0209317581"
                className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone} // Make sure the value is bound to Formik state
                inputMode="tel"
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="mt-4 w-full rounded-xl bg-brand-600 p-3 text-lg font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Reset
              </button>

              <div className="mt-4 flex justify-between gap-3">
                <button
                  onClick={() => navigate("/loginform")}
                  className="flex-1 rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signupform")}
                  className="flex-1 rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                >
                  Sign up
                </button>
              </div>
            </div>
          )}
        </Formik>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
