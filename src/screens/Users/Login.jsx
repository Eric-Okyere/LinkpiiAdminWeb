import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { signin } from "./Auth";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../../Redux/actions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import baseURL from "../../assets/baseURL";
import GoogleLoginButton from "./GoogleLoginButton";
import AuthLayout from "../../components/ui/AuthLayout";


const initialValues = {
  email: "",
  password: "",
};

const validationSchema = yup.object({
  email: yup.string().trim().required("Please input your email!"),
  password: yup.string().trim().min(4, "Your password is too short!").required("Please input your password!"),
});

const Login = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  loggedIn

  useEffect(() => {
    if (login) {
      window.location.href = "/";
    }
  }, [login]);

  const handleLogin = async (values) => {
    try {
        setLoading(true);
        const res = await signin(values);
        if (!res.success) {
            setErrorMessage(res.error);
        } else {
            dispatch(loggedIn(res.user));
           console.log("Logged-in user:", res.user);
        }
    } catch (error) {
        console.error("Login Error:", error);
        setErrorMessage("An error occurred during login. Please try again.");
    } finally {
        setLoading(false);
    }
};



const handleGoogleLoginSuccess = (user, token) => {
  dispatch(loggedIn(user));
  localStorage.setItem('authToken', token);
};




  return (
    <>
      <Helmet>
        <title>Log in</title>
        <meta
          name="description"
          content="Log in to your Linkpii account to buy, sell, rent and chat with other users."
        />
      </Helmet>
      <AuthLayout
        eyebrow="Welcome back"
        title="Log in to buy, sell and manage your listings."
        subtitle="Pick up right where you left off — your posts, chats and orders are all waiting."
      >
        <h1 className="font-display text-2xl font-bold text-ink-900">Log in</h1>
        <p className="mt-1 mb-6 text-sm text-ink-500">
          Don&rsquo;t have an account?{" "}
          <Link to="/signupform" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign up
          </Link>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
            >
              {/* Email Input */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-ink-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPassword?(<FaEye />):(<FaEyeSlash />)}

                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl bg-brand-600 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none ${
                  loading && "cursor-not-allowed opacity-50"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Forgotten Password */}
              <div className="mt-4 text-right">
                <Link
                  to="/forgotpassword"
                  className="text-sm text-ink-500 hover:text-brand-700"
                >
                  Forgotten Password?
                </Link>
              </div>
            </form>
          )}
        </Formik>

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

export default Login;
