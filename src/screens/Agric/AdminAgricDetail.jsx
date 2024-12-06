import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import baseURL from "../../assets/baseURL";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdminAgricDetail = () => {
  const { id } = useParams(); // Fetch the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}send/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a53d] border-solid">Linkpii</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Product not found.</p>
      </div>
    );
  }


  const sliderSettings = {
    dots: true, // Shows navigation dots below the slider
    infinite: true, // Enables infinite looping of slides
    speed: 400, // Transition speed (in ms)
    slidesToShow: 1, // Number of slides to display at a time
    slidesToScroll: 1, // Number of slides to scroll per click
    autoplay: true, // Enables automatic sliding
    autoplaySpeed: 4000, // Interval between slides in autoplay mode
    arrows: true, // Enables navigation arrows
  };

  

  return (
    <div className="flex flex-col min-h-screen bg-[#f5a53d] pt-28 px-4 md:px-12 ">
      {/* Product Details */}
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mb-10">
        <div className="flex flex-col gap-8">
          {/* Carousel */}
          <div className="flex-1">
            <Slider {...sliderSettings} className="rounded-md overflow-hidden">
              {/* Primary Image */}
              <div>
                <img
                  src={product.picture}
                  alt="Product"
                  className="w-full md:mx-64 md:w-[70%] h-[60vh] rounded"
                />
              </div>

              {/* Secondary Image */}
              <div>
                <img
                  src={product.picturesec}
                  alt="Secondary"
                  className="w-full md:mx-64 md:w-[70%] h-[60vh] rounded"
                />
              </div>

              {/* Additional Images */}
              {product.additionalPictures &&
                product.additionalPictures.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt={`Additional ${index + 1}`}
                      className="w-full md:mx-64 md:w-[70%] h-[60vh] rounded"
                    />
                  </div>
                ))}

              {/* Video */}
              {product.video && (
                <div>
                  <video
                    src={product.video}
                    controls
                    autoPlay={true}
                    className="w-full md:mx-64 md:w-[70%] h-[60vh] rounded"
                  ></video>
                </div>
              )}
            </Slider>
          </div>

          {/* Product Information */}
          <div className="flex-1 md:text-center md:text-lg font-bold">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
            <p className="text-gray-700 mb-2">
              <strong>Region:</strong> {product.region}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Town:</strong> {product.town}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong> {product.location}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Views:</strong> {product.views}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> {product.phone}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Whatsapp:</strong> {product.whatsapp}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Status:</strong>{" "}
              {product.approved ? (
                <span className="text-green-600 font-semibold">Approved</span>
              ) : (
                <span className="text-red-600 font-semibold">Not Approved</span>
              )}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Description:</strong> {product.description || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgricDetail;
