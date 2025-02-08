import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { signin } from "./Auth";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from "../../Redux/actions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
            dispatch(loggedIn(res.user)); // Store full user data
           
        }
    } catch (error) {
        console.error("Login Error:", error);
        setErrorMessage("An error occurred during login. Please try again.");
    } finally {
        setLoading(false);
    }
};





  return (
    <div className="flex min-h-screen bg-black items-center justify-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-white"
          >
            <h2 className="text-center text-2xl font-bold text-[#f5a53d] mb-6">
              Feel free to login
            </h2>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm" htmlFor="password">
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
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword?(<FaEye />):(<FaEyeSlash />)}
                  
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#f5a53d] rounded text-center text-white font-semibold hover:bg-black focus:outline-none ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Forgotten Password */}
            <div className="mt-4 text-right">
              <Link
                to="/forgotpassword"
                className="text-sm text-gray-400 hover:text-white"
              >
                Forgotten Password?
              </Link>
            </div>

            {/* Signup Link */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Don’t have an account?
              </p>
              <Link
                to="/signupform"
                className="bg-[#f5a53d] text-white py-2 px-4 rounded hover:bg-black"
              >
                Signup
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
