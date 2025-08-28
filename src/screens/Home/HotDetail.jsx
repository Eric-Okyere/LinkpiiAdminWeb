import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { LuPhoneCall } from "react-icons/lu";
import { FaWhatsappSquare } from "react-icons/fa";
import { BsFlagFill } from "react-icons/bs";
import { useSelector } from "react-redux";

function HotDetail() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const swiperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const videos = [item?.video, item?.videosec].filter(Boolean);
  const [error, setError] = useState(null);
  const [complaintError, setComplaintError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const UserState = useSelector((state) => state.user.id);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);







  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";


  const getCommentsUrl = (id, type) => {
    if (type === "fashion") return `${baseURL}comment/comments/${id}`;
    if (type === "building") return `${baseURL}buidingcomment/comments/${id}`;
    if (type === "shop") return `${baseURL}shopcomment/comments/${id}`;
    return null;
  };



  // fetch comments
  useEffect(() => {
    let alive = true;

    const loadComments = async () => {
      if (!item?._id || !type) return;
      setIsCommentsLoading(true);

      try {
        const url = getCommentsUrl(item._id, type);
        if (!url) return;

        const res = await fetch(url);
        const data = res.ok ? await res.json() : { comments: [] };

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.comments)
          ? data.comments
          : [];

        if (alive) setComments(list);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        if (alive) setIsCommentsLoading(false);
      }
    };

    loadComments();
    return () => {
      alive = false;
    };
  }, [item?._id, type]);



// console.log("All comment:",comments)
// console.log("UserStateId:",UserState)


  // Fetch main item
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id || !type) return; // Don’t fetch if id/type don’t exist
      try {
        setIsLoading(true);
        let url = "";
        if (type === "fashion") url = `${baseURL}fashionpost/${id}`;
        else if (type === "building") url = `${baseURL}buildings/${id}`;
        else if (type === "shop") url = `${baseURL}shops/${id}`;
        else return;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch detail");
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching detail:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [type, id]);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${UserState}`);
      if (response.ok) {
        const data = await response.json();

        if (data) {
          setUserData(data);
          // console.log("✅ User fetched:", data.name); // log API response directly
        } else {
          console.warn("⚠️ No valid user data received:", data);
          setUserData(null);
        }
      } else {
        console.error("❌ Failed to fetch user");
        setUserData(null);
      }
    } catch (error) {
      console.error("🔥 Error fetching user:", error);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  if (id) fetchUser();
}, [id]);

// console.log("UserDataName:",userData.name)

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!type || !id) return;
      try {
        let url = "";
        if (type === "fashion") url = `${baseURL}fashionpost/${id}/hotrelated`;
        else if (type === "building") url = `${baseURL}buildings/${id}/hotrelated`;
        else if (type === "shop") url = `${baseURL}shops/${id}/hotrelated`;
        else return;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch related products");
        const data = await response.json();

        // Exclude the current product
        const filtered = data.filter((p) => String(p.id) !== String(id));
        setRelated(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error.message);
      }
    };
    fetchRelated();
  }, [type, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }



const handleCommentSubmit = async (e) => {
  e?.preventDefault?.();
  if (!newComment.trim() || !item?._id) return;

  setIsPosting(true); // ✅ start loading

  const payload = { 
    userId: userData?.id || UserState, 
    content: newComment.trim() 
  };

  let endpoint = '';
  switch (type?.toLowerCase()) {
    case 'fashion':
      endpoint = `${baseURL}comment/${item._id}/comments`;
      break;
    case 'building':
      endpoint = `${baseURL}buidingcomment/${item._id}/comments`;
      break;
    case 'shop':
      endpoint = `${baseURL}shopcomment/${item._id}/comments`;
      break;
    default:
      console.warn('❌ Unknown item type:', type);
      setIsPosting(false);
      return;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setNewComment('');

    // ✅ Reload comments
    setIsCommentsLoading(true);
    const [f, b, s] = await Promise.all([
      fetch(`${baseURL}comment/comments/${item._id}`),
      fetch(`${baseURL}buidingcomment/comments/${item._id}`),
      fetch(`${baseURL}shopcomment/comments/${item._id}`),
    ]);

    const fj = f.ok ? await f.json() : {};
    const bj = b.ok ? await b.json() : {};
    const sj = s.ok ? await s.json() : {};

    setComments([
      ...(Array.isArray(fj.comments) ? fj.comments : []),
      ...(Array.isArray(bj.comments) ? bj.comments : []),
      ...(Array.isArray(sj.comments) ? sj.comments : []),
    ]);
  } catch (err) {
    console.error('❌ Failed to post comment:', err);
  } finally {
    setIsCommentsLoading(false);
    setIsPosting(false); // ✅ stop loading
  }
};







  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-bold">Item not found</p>
      </div>
    );
  }



    const handleVideoEnd = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      swiper.slideTo(0); // Reset Swiper to the first slide
      swiper.autoplay.start(); // Restart autoplay
    }
  };




const openDial = async () => {
  try {
    const response = await fetch(`${baseURL}call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        receiverphone: item.phone,
        recname: item.name,
        pagename: " Hot fashion Web ",
      }),
    });

    if (response.ok) {
      window.open(`tel:${item.phone}`, '_self');
      }

    
  } catch (error) {
    console.error('Error sending user data:', error);
  }
};




const WhatsApp = async () => {
  try {
    // Send user data to the backend
    const response = await fetch(`${baseURL}whatsapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        receiverphone: item.phone,
        recname: item.name,
        pagename: " Hot fashion Web ",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send user data.");
    }

    console.log("User info sent successfully");

    // Open WhatsApp with the provided number and message
    openWhatsApp(
      item.whatsapp, 
      `Hello! I saw ${item.name} on Linkpii, I'm interested in your product on Linkpii.com. Can I get more details?`
    );
  } catch (error) {
    console.error("Error sending user info to backend:", error);
  }
};


const openWhatsApp = (phoneNumber, message = "") => {
  if (!phoneNumber) {
    console.error("Phone number is required to open WhatsApp.");
    return;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  console.log("Opening WhatsApp URL:", whatsappURL);

  // Use location.href instead of window.open for mobile
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    window.location.href = whatsappURL;
  } else {
    window.open(whatsappURL, "_blank");
  }
};

 const options = [
    "Fraud",
    "Scam",
    "Spam",
    "Sexual Content",
    "Abusive",
    "Infringes my right",
    "Infringes copyright",
  ];

  

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };



const handleCompliants = async () => {
  if (loadingUser) {
    setComplaintError("⏳ Loading user data. Please wait.");
    return;
  }

  if (!userData) {
    setComplaintError("❌ No user found. Please log in first.");
    return;
  }

  if (!selectedOption.trim()) {
    setComplaintError("⚠️ Please select one option above.");
    return;
  }

  const complaintData = {
    sendername: userData.name,
    senderphone: userData.phone,
    product: item.name,
    productphone: item.phone,
    complaint: selectedOption,
  };

  try {
    setIsLoading(true);
    setComplaintError("");

    const response = await fetch(`${baseURL}compliants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaintData),
    });

    if (response.ok) {
      alert("✅ Complaint submitted successfully.");
      setIsModalOpen(false);
      setSelectedOption("");
    } else {
      const errorText = await response.text();
      setComplaintError("❌ Failed to send complaint: " + errorText);
    }
  } catch (error) {
    console.error("Error sending complaint:", error);
    setComplaintError("❌ Network error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};



const handleEditComment = async (e, commentId) => {
  e.preventDefault();
  if (!editedContent.trim()) return;

  let endpoint = "";
  switch (type?.toLowerCase()) {
    case "fashion":
      endpoint = `${baseURL}comment/comments/${commentId}`;
      break;
    case "building":
      endpoint = `${baseURL}buidingcomment/comments/${commentId}`;
      break;
    case "shop":
      endpoint = `${baseURL}shopcomment/comments/${commentId}`;
      break;
    default:
      return;
  }

  try {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedContent }),
    });

    if (!res.ok) throw new Error("Failed to edit comment");

    // update state
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, content: editedContent } : c
      )
    );
    setEditingCommentId(null);
    setEditedContent("");
  } catch (err) {
    console.error("❌ Error editing comment:", err);
  }
};

const handleDeleteComment = async (commentId) => {
   const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
  if (!confirmDelete) return; // stop if user cancels

  let endpoint = "";
  switch (type?.toLowerCase()) {
    case "fashion":
      endpoint = `${baseURL}comment/comments/${commentId}`;
      break;
    case "building":
      endpoint = `${baseURL}buidingcomment/comments/${commentId}`;
      break;
    case "shop":
      endpoint = `${baseURL}shopcomment/comments/${commentId}`;
      break;
    default:
      return;
  }

  try {
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete comment");

    // remove from UI
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
  }
};



  

  return (
    <div className="p-4 sm:p-6 md:p-12 bg-gray-50 min-h-screen font-serif mt-24">
      {/* Back Button */}
      {/* <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-[#f5a53d] text-white rounded-lg shadow"
      >
        Go Back
      </button> */}

      {/* Responsive Layout: Carousel + Info */}
      <div className="flex flex-col justify-center lg:flex-row gap-10">
        {/* Carousel Section */}
        <div className="w-full lg:w-1/2">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            pagination={{ clickable: true }}
            navigation
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            slidesPerView={1}
            className="rounded-lg shadow-lg"
          >
            {/* First Image */}
            {item.picture && (
              <SwiperSlide>
                <img
                  src={item.picture || fallbackImage}
                  alt={item.name}
                  className="w-full max-h-[250px] sm:max-h-[350px] lg:max-h-[500px] object-cover rounded-lg"
                />
              </SwiperSlide>
            )}

            {/* Second Image */}
            {item.picturesec && (
              <SwiperSlide>
                <img
                  src={item.picturesec || fallbackImage}
                  alt={`${item.name}-second`}
                  className="w-full max-h-[250px] sm:max-h-[350px] lg:max-h-[500px] object-cover rounded-lg"
                />
              </SwiperSlide>
            )}

            {/* Video */}
            {item.video && (
              <SwiperSlide>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-h-[250px] sm:max-h-[350px] lg:max-h-[500px] rounded-lg object-cover"
                  src={item.video}
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Item Info Section */}
         <div className=" text-center lg:text-start md:text-start md:mt-0 lg:mt-0 -ml-6 px-4 sm:px-6 md:px-8 lg:px-12 max-w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{item.name}</h1>
        <div className="space-y-2 ml-8 md:ml-0 sm:ml-0 lg:ml-0">
         {item.discount&&(
            <>
              <div className="flex justify-between ">
            <p className="text-sm text-gray-500 line-through">
              Gh¢{item.price}
            </p>
            <p className="text-md text-[#f5a53d] font-bold">
              Gh¢{(item.price - (item.price * item.discount) / 100).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-between ">
            <p className="text-md text-[#f5a53d] font-bold">{item.discount}% OFF</p>

            <p className="text-md text-black font-semibold">
              You save Gh¢{((item.price * item.discount) / 100).toFixed(2)}!
            </p>

            
            </div>
          </>
         )}
         
           {
            !item.discount && !item.price &&(
              <strong className="text-[#f5a53d] text-lg sm:text-xl">Call and let's talk about the price.</strong>
            )
           } 

           {
            !item.discount && item.price &&(
              <strong className="text-[#f5a53d] text-lg sm:text-xl">Gh¢{item.price}</strong>
            )
           } 
        
        </div>
        
         <p className="mt-4 text-base sm:text-lg md:text-xl">
          {item.description || 'No description available.'}
        </p>
        
        {item.condition && (
          <div className="mt-2 flex justify-between ml-10 md:ml-0 sm:ml-0 lg:ml-0">
           <strong className="text-md sm:text-xl">Condition:</strong>
           <strong className="text-md sm:text-xl text-[#f5a53d]">{item?.condition}</strong>
       </div>
        )}
          
   
      <div className="flex justify-center">
        <p className="mt-2 text-base sm:text-lg md:text-xl">
       {item.region || 'N/A'},   {item.town || 'N/A'},  {item.location || 'N/A'}
        </p>
       
       </div>
      
        {/* Call and WhatsApp Buttons */}
        <div className="flex flex-col sm:flex-row  ml-10 md:ml-0 sm:ml-0 lg:ml-0 sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            onClick={openDial}
            className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-center w-full sm:w-40 animate-heartbeat"
          >
            <LuPhoneCall size={26} className="text-green-500" />
            <p className="ml-4">Call Now</p>
          </button>
      
          <button
            onClick={WhatsApp}
            className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-center w-full sm:w-40 animate-heartbeat"
          >
            <FaWhatsappSquare size={26} className="text-green-500" />
            <p className="ml-4">WhatsApp</p>
          </button>
        </div>
      
        {/* Report Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex ml-6 md:ml-0 sm:ml-0 lg:ml-0 justify-center mt-4 w-full px-4 py-2 text-sm font-medium text-red-500 bg-black rounded-md hover:bg-[#f5a53d] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          <BsFlagFill className="mt-1 mr-2" color="red" /> Report
        </button>

        {/* Comment Section */}
<div className="mt-6 bg-white shadow-md rounded-xl p-4 ml-10 md:ml-0 sm:ml-0 lg:ml-0">

  {/* Comment Form */}
  <form
    onSubmit={handleCommentSubmit}
    className="mt-4 flex items-center gap-2"
  >
    <input
      type="text"
      placeholder="Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  <button
  type="submit"
  disabled={!newComment.trim() || isPosting}
  className="px-4 py-2 bg-[#f5a53d] text-white rounded-lg hover:bg-black disabled:bg-gray-400 flex items-center gap-2"
>
  {isPosting ? (
    <>
      <span className="w-4 h-4 border-2 border-[#f5a53d] border-t-transparent rounded-full animate-spin"></span>
     
    </>
  ) : (
    "Post"
  )}
</button>

  </form>

  <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
    💬 Comments ({comments.length})
  </h2>

  {isCommentsLoading ? (
   <div className="flex justify-center items-center h-20">
       <span className="w-4 h-4 border-2 border-[#f5a53d] border-t-transparent rounded-full animate-spin"></span>
     </div>
  ) : comments.length > 0 ? (
    <>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
{comments.slice(0, visibleCount).map((comment, idx) => {
  

  return (
    <div key={idx} className="border-b pb-2 last:border-none">
      {editingCommentId === comment._id ? (
        <form
          onSubmit={(e) => handleEditComment(e, comment._id)}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#f5a53d] text-white rounded-lg hover:bg-black text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditingCommentId(null)}
            className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              {comment.user?.name || comment.userId || "Unknown User"}:
            </span>{" "}
            {comment.content}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(comment.dateCreated).toLocaleString()}
          </p>

          {/* ✅ Show Edit/Delete only if logged-in user is the owner */}
          {comment.user?._id === UserState && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditedContent(comment.content);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
        )}
        </>
      )}
    </div>
  );
})}

      </div>

      {comments.length > visibleCount && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Load more
          </button>
        </div>
      )}
    </>
  ) : (
    <p className="text-gray-500">No comments yet. Be the first!</p>
  )}

</div>




      
      
      </div>






      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="my-10">
          <h3 className="text-xl font-bold mb-4">Related Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  navigate(`/detail/${type}/${rel.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img
                  src={rel.picture || fallbackImage}
                  alt={rel.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg truncate">{rel.name}</h4>
                  <p className="text-sm text-gray-600">
                    {rel.price ? `Gh¢${rel.price}` : "Call for price"}
                  </p>

                   <p className="text-xs text-gray-600 truncate">
                        {rel.region}, {rel.town}
                      </p>
                    
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 sm:w-96 bg-white rounded-lg shadow-lg">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Report Options</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
      
              {/* Modal Content */}
              <div className="p-4 space-y-4">
                <div>
                  <label
                    htmlFor="selectedOption"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Selected Option
                  </label>
                  <input
                    type="text"
                    id="selectedOption"
                    value={selectedOption}
                    readOnly
                    className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Select an option"
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedOption === option ? 'bg-[#f5a53d] text-white' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
      
              {/* Modal Footer */}
              <div className="flex justify-end px-4 py-2 border-t border-gray-200">
                <button
                  onClick={handleCompliants}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Report
                </button>
              </div>
              {complaintError && (
                <h1 className="text-red-500 mt-1 flex justify-center">
                  {complaintError}
                </h1>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default HotDetail;
