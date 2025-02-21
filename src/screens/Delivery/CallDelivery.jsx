import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { LuPhoneCall } from "react-icons/lu";

const CallDelivery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [comments, setComments] = useState([]);
   const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [newCommentPosted, setNewCommentPosted] = useState(false);


  const user = useSelector((state) => state.user.id);

  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(`${baseURL}okada/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDriver(data);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${user}`);
      const data = await response.json();
      setUserData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        verified: data.verified,
      });

      if (driver) {
        const commentsResponse = await fetch(
          `${baseURL}okadacomment/comments/${driver._id}`
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);
      }
    } catch (error) {
      console.error("Error fetching user data or comments:", error);
    } finally {
      setIsCommentsLoading(false);
      setNewCommentPosted(false);
    }
  };

  const openDial = async () => {
    if (!userData.verified) {
      navigate("/verification");
      return;
    }

    try {
      const response = await fetch(`${baseURL}call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: driver.phone,
          recname: driver.name,
          pagename: "driver",
        }),
      });

      if (response.ok) {
        window.open(`tel:${driver.phone}`);
      } else {
        console.error("Failed to send user data.");
      }
    } catch (error) {
      console.error("Error sending user data:", error);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, [id]);

  useEffect(() => {
    if (driver) {
      fetchUserData();
    }
  }, [driver]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Driver not found.</p>
        <Link to="/drivers" className="text-blue-500 underline">
          Back to Drivers
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="pt-24 md:text-xl text-sm mx-4 md:mx-0 font-bold flex justify-center">
        Do you want to call {driver.name} to pick your products?
      </h1>

      <div className="p-6 min-h-screen bg-white pt-2 flex justify-center">
        <div className="flex flex-col md:flex-row items-center md:items-start w-fit h-fit bg-gray-200 rounded-lg p-6 shadow-md">
          <div className="flex flex-col">
            <div className="flex justify-center">
              <img
                src={driver.carpic}
                alt={driver.name}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>

            <div className="items-center flex flex-col">
              <button
                onClick={openDial}
                className="mt-6 flex bg-black text-white px-4 py-2 rounded-lg text-center w-40 animate-heartbeat"
              >
                 <LuPhoneCall size={26} className="text-green-500"/>
                               <p className="ml-4">Call Now</p> 
              </button>

              {/* <h1 className="text-lg font-semibold mt-4">Size: {driver?.size}</h1> */}
              <h1 className="text-[#f5a53d] text-xl font-semibold pt-4">NOTE!</h1>
              <h1 className="w-60  font-semibold">
                Our drivers close at 6:00pm. Book an appointment with the driver
                to pick your product at your convenient time.
              </h1>
              <Link
                to={`/appointment/${driver._id}`}
                className="mt-6 block bg-black text-white px-4 py-2 rounded-lg text-center w-40 animate-heartbeat"
              >
                Appointment
              </Link>
            </div>
          </div>

          <div className="md:ml-6 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{driver.name}</h1>
            <p className="mt-2 text-lg font-semibold">Region: {driver.region}</p>
            <p className="text-lg font-semibold">Town: {driver.town}</p>
            <p className="text-lg font-semibold">Location: {driver.location}</p>
            <p className="text-lg font-semibold">Car Number: {driver.carnum}</p>
            <img
              src={driver.driverpic}
              alt="Car"
              className="mt-4 w-96 rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CallDelivery;
