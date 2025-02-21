import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { LuPhoneCall } from "react-icons/lu";

const CallDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [comments, setComments] = useState([]);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [commentsToShow, setCommentsToShow] = useState(3);
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const user = useSelector((state) => state.user.id);


  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(`${baseURL}cars/${id}`);
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
          `${baseURL}drivercomment/comments/${driver._id}`
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);
      }
    } catch (error) {
      console.error("Error fetching user data or comments:", error);
    } 
    // finally {
    //   setIsCommentsLoading(false);
    //   setNewCommentPosted(false);
    // }
  };

// console.log("User data",userData)

  const handleButtonClick = async () => {
    if (!userData.verified) {
      navigate("/verification");
      return;
    }
  
    // If the phone number is already visible, revert to "View Contact" without sending data
    if (isPhoneVisible) {
      setIsPhoneVisible(false); // Revert to "View Contact"
      console.log("Reverting to 'View Contact', no data sent to backend.");
      return;
    }
  
    try {
      // Send user data to the backend
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
          pagename: "Driver Web",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send user data.");
      }
  
      console.log("User info sent successfully");
  
      // Additional behavior based on the environment
      if (isMobile) {
        // Redirect to the phone dialer for mobile devices
        location.href = `tel:${driver.phone}`;
      } else {
        // Toggle phone visibility for non-mobile devices
        setIsPhoneVisible(true);
      }
    } catch (error) {
      console.error("Error sending user info to backend:", error);
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




  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

 
  

  const handlePostComment = async () => {
    if (!comment.trim()) {
      alert('Please write a comment before posting.');
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}drivercomment/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user,
          content: comment,
        }),
      });
  
      if (response.ok) {
        const newComment = await response.json(); // Assuming the new comment is returned
        setComments((prevComments) => [
          {
            ...newComment,
            user: { _id: user, name: userData.name || 'Anonymous' }, // Ensure user is set
          },
          ...prevComments,
        ]);
        setComment('');
        alert('Comment posted successfully.');
      } else {
        console.error('Failed to post comment.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  





  const saveEditComment = async (commentId) => {
    if (!editingContent.trim()) {
      alert('Please write a comment before updating.');
      return;
    }
  
    try {
      console.log("Editing comment ID:", commentId);
      console.log("New Content:", editingContent);
  
      const response = await fetch(`${baseURL}drivercomment/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingContent,
        }),
      });
  
      const responseData = await response.json();
      console.log("Response Data:", responseData);
  
      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, content: editingContent } : comment
          )
        );
        
        // Reset edit mode
        setEditingCommentId(null);
        setEditingContent('');
        alert('Comment updated successfully.');
      } else {
        setError(responseData.message || 'Failed to update comment.');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      setError('Failed to edit comment.');
    }
  };
  
  
  



  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}drivercomment/comments/${commentId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Comment deleted successfully.');
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId)); // Remove comment from state
         // Trigger re-fetch or update state
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
  
    if (isNaN(date)) {
      return "Invalid Date"; // Handle invalid date
    }
  
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Now";
    }
  
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
  
    // Use toLocaleDateString to format the date
    return "Yesterday"
  };


  const handleLoadMore = () => {
    setCommentsToShow((prev) => prev + 3); // Increase by 3 on each click
  };



  return (
    <div className="font-serif mb-6 lg:mb-0 md:mt-16 lg:mt-16 ">
     


<div className="md:flex md:justify-center pt-20">


      <div className="p-6 min-h-screen bg-white ">
      <h1 className=" md:text-xl items-center text-sm mx-4 flex justify-center font-bold ">
        Do you want to call {driver.name} to pick your products?
      </h1>
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
                onClick={handleButtonClick}
                className="mt-6 flex bg-black text-white px-4 py-2 rounded-lg text-center w-40 animate-heartbeat"
              >
                <LuPhoneCall size={26} className="text-green-500" />
                <div className="ml-4">
                  {isMobile
                    ? "Call Now"
                    : isPhoneVisible
                    ? driver.phone
                    : <p className="text-xs font-bold pt-1">View contact</p>}
                </div>
              </button>

              <h1 className="text-lg font-semibold mt-4">Size: {driver?.size}</h1>
              <h1 className="text-[#f5a53d] text-xl font-semibold pt-4">NOTE!</h1>
              <h1 className="w-60  font-semibold">
                Our drivers close at 6:00pm. Book an appointment with the driver
                to pick your product at your convenient time.
              </h1>
              <Link
                // to={`/appointment/${driver._id}`}
                onClick={()=>alert("Under development")}
                className="mt-6 block bg-black text-white px-4 py-2 rounded-lg text-center w-40 animate-heartbeat font-bold"
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



{/* Comment */}
      <div className="mx-6 md:mx-0 pt-6 font-bold">
        <h1 className=" flex justify-center">Add your Comment here.</h1>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handlePostComment}
          className="mt-2 text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-black transition"
        >
          Add Comment
        </button>

        <div className="mt-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          {comments.slice(0, commentsToShow).map((comment) => (
            <div key={comment._id} className="p-4 mb-4 bg-gray-100 rounded shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{comment.user?.name || 'Anonymous'}</h3>
                <span className="text-sm text-gray-500">{formatDate(comment.dateCreated)}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>

              {/* Edit/Delete buttons */}
              {comment.user && comment.user._id === user && (
              <div className="flex mt-2 justify-between">
                <button
                  onClick={() => handleEditComment(comment._id, comment.content)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteCommentId(comment._id); // Set the current comment ID
                    setIsDeleteModalOpen(true); // Open the modal
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
              )}

              {editingCommentId === comment._id && (
          <div className="mt-4">
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => saveEditComment(comment._id)}
              className="mt-2 px-4 py-2 bg-black text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
              )}
            </div>
          ))}

          {comments.length > commentsToShow && (
            <div className='flex justify-center'>
            <button
              onClick={handleLoadMore}
              className="mt-4 bg-black text-white p-2 rounded-lg"
            >
              Load more comments
            </button>
            </div>
          )}
        </div>
        </div>




</div>

{isDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-96 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <p>Are you sure you want to delete this comment?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDeleteComment(deleteCommentId);
              setIsDeleteModalOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CallDriver;
