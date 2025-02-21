import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import { loggedOut } from "../../Redux/actions";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const myUser = useSelector((state) => state.user.id);
  const [isModalVisibleChange, setIsModalVisibleChange] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  

const handleLogout = () => {
  setIsLogoutModalVisible(true);
};

const confirmLogout = () => {
  dispatch(loggedOut());
  navigate('/loginform');
};

const cancelLogout = () => {
  setIsLogoutModalVisible(false);
};

// console.log("User Info", myUser)
  
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}userbyid/${myUser}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setFetchedUserData(data);
        setImageKey(Date.now()); // Force image reload
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [myUser]);


  const toggleVisibility = (field) => {
    setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    if (newpassword !== confirmpassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    try {
      const response = await fetch(`${baseURL}changepass`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: fetchedUserData._id,
          currentPassword: oldpassword,
          newPassword: newpassword,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(result.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Server error occurred.");
    }
  };



  

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-black min-h-screen p-6 text-white pt-32 font-serif">
      {fetchedUserData ? (
        <>
          {fetchedUserData.avatar ? (
             <img
             key={imageKey} // Force reload when avatar changes
             className="w-24 h-24 rounded-full mt-4 object-cover"
             src={fetchedUserData.avatar || fetchedUserData.picture}
             alt="Profile"
             onError={(e) => {
               e.target.onerror = null;
               e.target.src = "/fallback-avatar.png"; // Fallback image
             }}
           />
          ) : (
            <FaRegUser size={64} className="mt-4" />
          )}

          <div className="text-center mt-4">
            <h2 className="text-xl font-bold underline">Welcome to Linkpii</h2>
            <p className="text-lg font-semibold">{fetchedUserData.name} {fetchedUserData.lastname}</p>
            <p className="text-lg">{fetchedUserData.email}</p>
            <p className="text-lg">{fetchedUserData.phone}</p>
          </div>

          <button
            className="mt-6 bg-[#f5a53d] text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsModalVisibleChange(true)}
          >
            Change Password
          </button>

          <button
            className="mt-6 bg-[#f5a53d] text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            onClick={handleLogout}
          >
            Log out
          </button>



          {isModalVisibleChange && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800">Change your password</h2>
                {['old', 'new', 'confirm'].map((field, idx) => (
                  <div key={idx} className="relative w-full mt-2">
                    <input
                      type={passwordVisible[field] ? "text" : "password"}
                      className="w-full p-2 border rounded-lg pr-10 placeholder-black text-black"
                      placeholder={
                        field === "old" ? "Enter current password" :
                        field === "new" ? "Enter new password" : "Confirm password"
                      }
                      value={field === "old" ? oldpassword : field === "new" ? newpassword : confirmpassword}
                      onChange={(e) => {
                        if (field === "old") setOldPassword(e.target.value);
                        else if (field === "new") setNewPassword(e.target.value);
                        else setConfirmPassword(e.target.value);
                      }}
                    />
                    <span
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => toggleVisibility(field)}
                    >
                      {passwordVisible[field] ? <FaEyeSlash color="black" /> : <FaEye color="black"/>}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-[#f5a53d] text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                    onClick={handleChangePassword}
                  >
                    Change
                  </button>
                  <button
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                    onClick={() => setIsModalVisibleChange(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}



          {isLogoutModalVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Are you sure you want to log out?</h2>
      <div className="flex justify-between mt-4">
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          onClick={confirmLogout}
        >
          Yes, Logout
        </button>
        <button
          className="bg-[#f5a53d] text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          onClick={cancelLogout}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default MyProfile;
