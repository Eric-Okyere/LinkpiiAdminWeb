import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../assets/baseURL";

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
    <div className="flex min-h-screen bg-black items-center justify-center">
      {message.text && (
        <div className={`text-center p-2 text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>{message.text}</div>
      )}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleForgetPassword}>
        {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-white">
            <h1 className="text-3xl font-bold text-[#f5a53d] mb-6">Reset Password</h1>
            <div className="w-full max-w-sm">
              <p className="text-red-500 mb-2">{touched.phone && errors.phone ? errors.phone : ""}</p>
              <input
                type="text"
                name="phone"
                placeholder="Please enter your phone number eg. 0209317581"
                className="w-full p-3 rounded-lg bg-gray-200 mb-4 text-black"
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone} // Make sure the value is bound to Formik state
                inputMode="tel"
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#f5a53d] text-white p-3 rounded-lg text-lg hover:bg-black"
              >
                Reset
              </button>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate("/loginform")}
                  className="bg-[#f5a53d] text-white px-6 py-2 rounded-lg hover:bg-black"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signupform")}
                  className="bg-[#f5a53d] text-white px-6 py-2 rounded-lg hover:bg-black"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;