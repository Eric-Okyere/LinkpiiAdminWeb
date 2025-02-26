import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../Redux/actions";
import { Link, useNavigate } from "react-router-dom";
import baseURL from "../../assets/baseURL";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { loggedIn } from "../../Redux/actions";
import PhoneInput from "react-phone-input-2";
import GoogleLoginButton from "./GoogleLoginButton";

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

  // const handleSignup = async (values, formikActions) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${baseURL}create-user`, values);
  //     const { success, user } = response.data;
  //     if (success) {
  //       formikActions.resetForm();
  //       dispatch(signUp(user.id));
  //       setMessage({ text: "Signed up successfully!", type: "success" });
  //       setTimeout(() => navigate("/loginform"), 2000);
  //     } else {
  //       setMessage({ text: "Signup failed. Please try again.", type: "error" });
  //     }
  //   } catch (error) {
  //     setMessage({
  //       text: error.response?.data?.message || "Something went wrong.",
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //     formikActions.setSubmitting(false);
  //   }
  // };



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
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#f5a53d]">Register with us</h2>
        {message.text && (
          <div className={`p-3 mb-4 rounded text-center ${message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{message.text}</div>
        )}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSignup}>
          {({ errors, touched, handleSubmit, handleChange, handleBlur, values }) => (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="First Name" onChange={handleChange("name")} onBlur={handleBlur("name")} value={values.name} className="w-full bg-white p-2 border rounded" />
              {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <input type="text" placeholder="Last Name" onChange={handleChange("lastname")} onBlur={handleBlur("lastname")} value={values.lastname} className="w-full bg-white p-2 border rounded" />
              {touched.lastname && errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
              <input type="email" placeholder="Email" onChange={handleChange("email")} onBlur={handleBlur("email")} value={values.email} className="w-full p-2 bg-white border rounded" />
              {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            
              <PhoneInput inputClass="w-full p-2 bg-white border-none outline-none shadow-none rounded" type="tel"  country={"gh"} placeholder="Phone Number" onChange={(phone) => handleChange("phone")(`+${phone}`)} onBlur={handleBlur("phone")} value={values.phone} className="w-full p-2 bg-white rounded" />


              {touched.phone && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Password" onChange={handleChange("password")} onBlur={handleBlur("password")} value={values.password} className="w-full p-2 bg-white border rounded" />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-4 text-sm"> {showPassword?(<FaEye />):(<FaEyeSlash />)}</button>
              </div>
              {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" onChange={handleChange("confirmPassword")} onBlur={handleBlur("confirmPassword")} value={values.confirmPassword} className="w-full p-2 bg-white border rounded" />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-4 text-sm"> {showPassword?(<FaEye />):(<FaEyeSlash />)}</button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              <button type="submit" className={`w-full p-2 bg-black text-white rounded ${loading && "opacity-50 cursor-not-allowed"}`} disabled={loading}>{loading ? "Signing up..." : "Signup"}</button>
            </form>
          )}
        </Formik>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-400 text-sm">Already have an account?</p>
          <Link to="/loginform" className="bg-[#f5a53d] text-white py-2 px-4 rounded hover:bg-black">Login</Link>
        </div>
      </div>





    
      <div className="mt-10">
        <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />
      </div>

</div>
    
  );
};

export default Signup;
