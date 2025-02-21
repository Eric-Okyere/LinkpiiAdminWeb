import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { BsFlagFill } from "react-icons/bs";
import baseURL from '../../assets/baseURL';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { LuPhoneCall } from "react-icons/lu";
import { FaWhatsappSquare } from "react-icons/fa";


const AgricDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userid = useSelector((state) => state.user.id);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [complaintError, setComplaintError] = useState('');
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsToShow, setCommentsToShow] = useState(3);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [newCommentPosted, setNewCommentPosted] = useState(false);
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);






  const images = [product?.picture, product?.picturesec].filter(Boolean);
  const videos = [product?.video, product?.videosec].filter(Boolean);
  

  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper; // Safe access to swiper instance
    if (swiper) {
      const currentSlide = swiper.slides[swiper.activeIndex];

      if (currentSlide && currentSlide.dataset.type === "video") {
        swiper.params.autoplay.delay = 10000; // 10 seconds for videos
      } else {
        swiper.params.autoplay.delay = 1000; // 3 seconds for images
      }
      swiper.autoplay.start();
    }
  };

  const handleVideoEnd = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      swiper.slideTo(0); // Reset Swiper to the first slide
      swiper.autoplay.start(); // Restart autoplay
    }
  };

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;

    if (swiper) {
      swiper.params.autoplay.reverseDirection = false; // Start with normal direction
      swiper.autoplay.start(); // Ensure autoplay starts
    }
  }, []);



  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${userid}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone });

      const commentsResponse = await fetch(`${baseURL}agriccomment/comments/${id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments);
      // console.log("All Comments:", commentsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    const handleBackButton = (event) => {
      // Check if the user is trying to navigate back from this page
      if (window.location.pathname === `/buy/${id}`) {
        event.preventDefault(); // Prevent the default back navigation
        navigate("/tabs", { state: { initialIndex: 3 } }); // Redirect to your intended tab
      }
    };
  
    // Add the event listener for the back button (popstate event)
    window.addEventListener("popstate", handleBackButton);
  
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [id, navigate]);
  


 
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseURL}send/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        setProduct(data);

        const relatedResponse = await fetch(`${baseURL}send/${id}/related`);
        if (!relatedResponse.ok) throw new Error('Failed to fetch related products');
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchUserData();
  }, [id]);
  


  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Product not found.</div>;
  }

  
  const fallbackImage = 'https://via.placeholder.com/600?text=No+Image+Available';
  const options = [
    "Fraud",
    "Scam",
    "Spam",
    "Sexual Content",
    "Abusive",
    "Infringes my right",
    "Infringes copyright",
  ];

  const handleCompliants = async () => {
    if (!selectedOption.trim()) {
      setComplaintError("Please select one option above.");
      return;
    }

    const complaintData = {
      sendername: userData.name,
      senderphone: userData.phone,
      product: product.name,
      productphone: product.phone,
      complaint: selectedOption,
    };

    try {
      const response = await fetch(`${baseURL}compliants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        alert("Product reported successfully.");
        setIsModalOpen(false);
        setSelectedOption('');
      } else {
        console.error("Failed to block product.");
      }
    } catch (error) {
      console.error("Error sending complaint:", error);
    }
  };

 

  

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
      const response = await fetch(`${baseURL}agriccomment/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userid,
          content: comment,
        }),
      });
  
      if (response.ok) {
        const newComment = await response.json(); // Assuming the new comment is returned
        setComments((prevComments) => [
          {
            ...newComment,
            user: { _id: userid, name: userData.name || 'Anonymous' }, // Ensure user is set
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
  
      const response = await fetch(`${baseURL}agriccomment/comments/${commentId}`, {
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
      const response = await fetch(`${baseURL}agriccomment/comments/${commentId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Comment deleted successfully.');
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId)); // Remove comment from state
        setNewCommentPosted(true); // Trigger re-fetch or update state
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };

  const handleLoadMore = () => {
    setCommentsToShow((prev) => prev + 3); // Increase by 3 on each click
  };
  

  const handleRelatedProductClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    
  }





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
  



const openDial = async () => {
  try {
    // Sending call request
    const response = await fetch(`${baseURL}call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        receiverphone: product.phone,
        recname: product.name,
        pagename: "fashion",
      }),
    });

    if (response.ok) {
      // Open the dialer using window.open
      window.open(`tel:${product.phone}`, '_self');

      // Sending viewer comment
      // const responseview = await fetch(`${baseURL}productviewers/${id}/comments`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId: userid,
      //     content: userData.phone,
      //   }),
      // });

      // if (responseview.ok) {
      //   console.log('Comment posted successfully.');
      // } else {
      //   console.error('Failed to post comment.');
      // }
    } else {
      console.error('Failed to send user data.');
    }
  } catch (error) {
    console.error('Error sending user data:', error);
  }
};








const WhatsApp = async () => {
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
        receiverphone: product.phone,
        recname: product.name,
        pagename: "Spare Part Website",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send user data.");
    }

    console.log("User info sent successfully");

    // Open WhatsApp with the provided number and message
    openWhatsApp(
      product.whatsapp, 
      `Hello ${product.name}, I'm interested in your product on Linkpii.`
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


  

  return (
    <div className="container mx-auto p-4 md:p-8 md:mt-24 mt-20 mb-28">
       
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Media Display */}
        <div className="w-full md:w-1/2">
        <Swiper
      ref={swiperRef}
      modules={[Pagination, Navigation, Autoplay]}
      pagination={{ clickable: true }}
      navigation
      autoplay={{
        delay: 1000, // Default to 3 seconds
        disableOnInteraction: false,
      }}
      onSlideChange={handleSlideChange}
      className="relative overflow-hidden rounded-lg"
    >


{videos.length > 0 &&
        videos.map((video, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center"
            data-type="video" // Mark this slide as a video
          >
            <video
              className="object-cover w-[90%] max-h-[50vh] mx-auto md:mx-36 rounded-lg md:w-3/4 md:max-h-[50vh] lg:w-2/3 lg:max-h-[50vh]"
              src={video}
              autoPlay={true}
              controls={true}
              playsInline
              onPlay={(e) => {
                // Pause autoplay while the video plays
                swiperRef.current?.swiper.autoplay.stop();
              
              }}
              onEnded={handleVideoEnd} // Restart Swiper after the video ends
            />
          </SwiperSlide>
        ))}




      {/* Images */}
      {images.length > 0 &&
        images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center"
            data-type="image" // Mark this slide as an image
          >
            <img
              className="object-contain w-[90%] max-h-[85vh] mx-auto md:mx-36 rounded-lg md:w-3/4 md:max-h-[70vh] lg:w-2/3 lg:max-h-[60vh]"
              src={image}
              alt={`Slide ${index}`}
            />
          </SwiperSlide>
        ))}

      {/* Videos */}
      
    </Swiper>

</div>


        
        

        {/* Product Details */}
        <div className="mt-6 md:mt-0 px-4 sm:px-6 md:px-8 lg:px-12 max-w-full">
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
  <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
    <strong className="text-[#f5a53d] text-lg sm:text-xl">Gh¢{product.price || 'N/A'}</strong>
    <strong className="text-lg sm:text-xl">{product?.condition}</strong>
  </div>

  <p className="mt-2 text-base sm:text-lg md:text-xl">
    <strong>Region:</strong> {product.region || 'N/A'}
  </p>
  <p className="mt-2 text-base sm:text-lg md:text-xl">
    <strong>Town:</strong> {product.town || 'N/A'}
  </p>
  <p className="mt-2 text-base sm:text-lg md:text-xl">
    <strong>Location:</strong> {product.location || 'N/A'}
  </p>
  <p className="mt-4 text-base sm:text-lg md:text-xl">
    {product.description || 'No description available.'}
  </p>

  {/* Call and WhatsApp Buttons */}
  <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
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
    className="inline-flex justify-center mt-4 w-full px-4 py-2 text-sm font-medium text-red-500 bg-black rounded-md hover:bg-[#f5a53d] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
  >
    <BsFlagFill className="mt-1 mr-2" color="red" /> Report
  </button>

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


  



      </div>


{/* Comment Section */}
<div className="mt-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handlePostComment}
          className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black transition"
        >
          Add Comment
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          {comments.slice(0, commentsToShow).map((comment) => (
            <div key={comment._id} className="p-4 mb-4 bg-gray-100 rounded shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{comment.user?.name || 'Anonymous'}</h3>
                <span className="text-sm text-gray-500">{formatDate(comment.dateCreated)}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>

              {/* Edit/Delete buttons */}
              {comment.user && comment.user._id === userid && (
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




{/* Related Products Section */}
 <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {relatedProducts.length === 0 ? (
              <div className="text-center text-gray-500 text-lg col-span-full">
                No products found. Please try a different category or search term.
              </div>
            ) : (
              relatedProducts.map((relatedProduct) => (
                <Link to={`/sparepart/${relatedProduct._id}`} key={relatedProduct._id}>
                  <div className="mb-2 bg-gray-200 rounded-lg shadow-lg p-3 break-inside-avoid">
                    {/* Product Image */}
                    <img
                      src={relatedProduct.picture || fallbackImage}
                      alt={relatedProduct.name || "No Image"}
                      className="w-full object-cover rounded-lg"
                      style={{ height: `${120 + Math.random() * 100}px` }} // Random heights
                    />

                    {/* Product Details */}
                    <div className="mt-3 w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold truncate">{relatedProduct.name}</h3>
                      <p className="text-md text-[#f5a53d] font-bold">Gh¢{relatedProduct.price}</p>
                      <p className="text-xs text-gray-600 truncate">
                        {relatedProduct.region}, {relatedProduct.town}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>



{/* Delete Confirmation Modal */}
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

export default AgricDetail;
