import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signUp } from "../../Redux/actions";
import { Link, useNavigate } from "react-router-dom";
import baseURL from "../../assets/baseURL";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();


//   const checkForToxicComments = async (text) => {
//     try {
//       const response = await axios.post("/api/toxic/analyze", { text });
//       return response.data.isToxic;
//     } catch (error) {
//       console.error(error);
//       return false; // Assume text is not toxic on error
//     }
//   };

//   const handleSignup = async (values, formikActions) => {
//     setLoading(true);
//     // const isToxic = await checkForToxicComments(`${values.name} ${values.lastname}`);
//     // if (isToxic) {
//     //   setLoading(false);
//     //   return setMessage({ text: "Your input contains inappropriate language.", type: "error" });
//     // }

//     const res = { success: true, user: { id: "123" } }; // Replace with actual API call
//     formikActions.setSubmitting(false);
//     setLoading(false);

//     if (!res.success) {
//       return setMessage({ text: res.message, type: "error" });
//     } else {
//       formikActions.resetForm(); // Reset form values
//       dispatch(signUp(res.user.id));
//       setMessage({ text: "Signed up successfully!", type: "success" });
//       setTimeout(() => navigate("/loginform"), 2000); // Navigate to login after a delay
//     }
//   };


  const handleSignup = async (values, formikActions) => {
    setLoading(true);
  
    try {
      // Make POST request to backend API
      const response = await axios.post(`${baseURL}create-user`, {
        name: values.name,
        lastname: values.lastname,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
  
      // If successful
      const { success, user } = response.data;
  
      if (success) {
        formikActions.resetForm(); // Reset form values
        dispatch(signUp(user.id)); // Dispatch Redux action (if needed)
        setMessage({ text: "Signed up successfully!", type: "success" });
  
        // Redirect to login page after a short delay
        setTimeout(() => navigate("/loginform"), 2000);
      } else {
        // Handle any error from the server
        setMessage({ text: "Signup failed. Please try again.", type: "error" });
      }
    } catch (error) {
      // Handle validation or server errors
      setMessage({
        text: error.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
      formikActions.setSubmitting(false);
    }
  };
  


  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#f5a53d]">Register with us</h2>
        {message.text && (
          <div
            className={`p-3 mb-4 rounded text-center ${
              message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched, handleSubmit, handleChange, handleBlur, values }) => (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  onChange={handleChange("lastname")}
                  onBlur={handleBlur("lastname")}
                  value={values.lastname}
                  className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {touched.lastname && errors.lastname && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  className="w-full p-2 bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  className="w-full p-2  bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              {/* Password */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  className="w-full p-2 bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  className="w-full p-2  bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-[#f5a53]"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full p-2 bg-black text-white rounded hover:bg-[#f5a53d] focus:outline-none ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}
        </Formik>

        <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Already have an account?
              </p>
              <Link
                to="/loginform"
                className="bg-[#f5a53d] text-white py-2 px-4 rounded hover:bg-black"
              >
                Signin
              </Link>
            </div>
      </div>
    </div>
  );
};

export default Signup;
