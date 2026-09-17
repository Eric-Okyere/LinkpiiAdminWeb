import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import { loggedOut } from "../../Redux/actions";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";

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
        console.log(data)
        setImageKey(Date.now()); // Force image reload
      } catch (error) {
        console.error("Error fetching user data:", error);
        // alert("Failed to fetch user data. Please try again.");
        // dispatch(loggedOut());
        // navigate('/loginform');
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
    <div className="flex justify-center items-center h-screen bg-ink-50">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50 pb-10 pt-28 sm:pt-32">
      <Container className="max-w-2xl">
        {fetchedUserData ? (
          <>
            <div className="flex flex-col items-center rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
              {fetchedUserData.avatar ? (
                <img
                  key={imageKey} // Force reload when avatar changes
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-50"
                  src={fetchedUserData.avatar || fetchedUserData.picture}
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-avatar.png"; // Fallback image
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <FaRegUser size={40} />
                </div>
              )}

              <div className="mt-4 text-center">
                <h2 className="font-display text-xl font-bold text-ink-900">Welcome to Linkpii</h2>
                <p className="mt-1 text-lg font-semibold text-ink-800">
                  {fetchedUserData.name} {fetchedUserData.lastname}
                </p>
                <p className="text-ink-500">{fetchedUserData.email}</p>
                <p className="text-ink-500">{fetchedUserData.phone}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700"
                  onClick={() => setIsModalVisibleChange(true)}
                >
                  Change Password
                </button>

                <button
                  className="rounded-xl border border-ink-200 px-5 py-2.5 font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>

            {isModalVisibleChange && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                  <h2 className="font-display text-xl font-bold text-ink-900">Change your password</h2>
                  {['old', 'new', 'confirm'].map((field, idx) => (
                    <div key={idx} className="relative mt-3 w-full">
                      <input
                        type={passwordVisible[field] ? "text" : "password"}
                        className="w-full rounded-xl border border-ink-200 bg-ink-50 p-3 pr-10 text-ink-800 placeholder-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
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
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-ink-400 hover:text-ink-600"
                        onClick={() => toggleVisibility(field)}
                      >
                        {passwordVisible[field] ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 flex justify-between gap-3">
                    <button
                      className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700"
                      onClick={handleChangePassword}
                    >
                      Change
                    </button>
                    <button
                      className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                      onClick={() => setIsModalVisibleChange(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isLogoutModalVisible && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                  <h2 className="font-display text-xl font-bold text-ink-900">Are you sure you want to log out?</h2>
                  <div className="mt-4 flex justify-between gap-3">
                    <button
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700"
                      onClick={confirmLogout}
                    >
                      Yes, Logout
                    </button>
                    <button
                      className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 font-semibold text-ink-700 transition-colors hover:bg-ink-50"
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
          <p className="text-center text-ink-500">No user data available</p>
        )}
      </Container>
    </div>
  );
};

export default MyProfile;
