import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../Redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import baseURL from "../../assets/baseURL";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { loggedIn } from "../../Redux/actions";
import PhoneInput from "react-phone-input-2";
import GoogleLoginButton from "./GoogleLoginButton";
import AuthLayout from "../../components/ui/AuthLayout";

const initialValues = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object({
  name: yup.string().trim().required("Please input your first name!"),
  lastname: yup.string().trim().required("Please input your last name!"),
  email: yup.string().trim().email("Invalid email!").required("Please input your email!"),
  phone: yup
    .string()
    .trim()
    .required("Please input your phone number!")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  password: yup
    .string()
    .trim()
    .min(4, "Your password is too short!")
    .required("Please input your password!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password!"),
});

const Signup = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const login = useSelector((state) => state.login);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async (values, formikActions) => {
    let formattedPhoneNumber = values.phone;

    // Ensure phone number includes a "+" and the correct country code
    if (!formattedPhoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+233${formattedPhoneNumber.replace(/^0+/, "")}`;
    } else {
      formattedPhoneNumber = formattedPhoneNumber.replace(/^(\+\d{1,3})0/, "$1");
    }

    console.log("Submitted phone number:", formattedPhoneNumber);

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}create-user`, {
        ...values,
        phone: formattedPhoneNumber, // Use the formatted phone number
      });

      const { success, user } = response.data;
      if (success) {
        formikActions.resetForm();
        dispatch(signUp(user.id));
        setMessage({ text: "Signed up successfully!", type: "success" });
        setTimeout(() => navigate("/loginform"), 2000);
      } else {
        setMessage({ text: "Signup failed. Please try again.", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
      formikActions.setSubmitting(false);
    }
  };

  useEffect(() => {
      if (login) {
        window.location.href = "/";
      }
    }, [login]);

    const handleGoogleLoginSuccess = (user, token) => {
      dispatch(loggedIn(user));
      localStorage.setItem('authToken', token);
    };



  return (
    <>
      <Helmet>
        <title>Sign up</title>
        <meta
          name="description"
          content="Create a free Linkpii account to buy, sell, rent and connect with other users in Ghana."
        />
      </Helmet>
      <AuthLayout
        eyebrow="Join Linkpii"
        title="Create an account to start buying, selling and renting."
        subtitle="It only takes a minute — list your first product, shop or rental as soon as you're in."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/loginform" className="font-semibold text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </p>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          {message.text && (
            <div
              className={`mb-4 rounded-xl p-3 text-center text-sm ${
                message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSignup}>
            {({ errors, touched, handleSubmit, handleChange, handleBlur, values }) => (
              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      onChange={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    {touched.name && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      onChange={handleChange("lastname")}
                      onBlur={handleBlur("lastname")}
                      value={values.lastname}
                      className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    {touched.lastname && errors.lastname && (
                      <p className="mt-1 text-xs text-red-500">{errors.lastname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  {touched.email && errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <PhoneInput
                    inputClass="!w-full !h-[46px] !text-base !rounded-xl !border !border-ink-200 !bg-ink-50 focus:!bg-white focus:!border-brand-400 focus:!ring-2 focus:!ring-brand-100"
                    type="tel"
                    country={"gh"}
                    placeholder="Phone Number"
                    onChange={(phone) => handleChange("phone")(`+${phone}`)}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                  />
                  {touched.phone && errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPassword?(<FaEye />):(<FaEyeSlash />)}
                  </button>
                </div>
                {touched.password && errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPassword?(<FaEye />):(<FaEyeSlash />)}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
                <button
                  type="submit"
                  className={`w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition-colors hover:bg-brand-700 ${
                    loading && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>
            )}
          </Formik>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <span className="h-px flex-1 bg-ink-200" />
          or
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />
        </div>
      </AuthLayout>
    </>
  );
};

export default Signup;
