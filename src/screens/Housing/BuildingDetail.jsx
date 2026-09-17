import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import Container from "../../components/ui/Container";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BuildingDetail = () => {
  const { id } = useParams(); // Fetch the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}buildings/${id}`);
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
      <div className="flex items-center justify-center h-screen bg-ink-50">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-ink-50">
        <p className="text-lg font-medium text-ink-600">Product not found.</p>
      </div>
    );
  }


  const sliderSettings = {
    dots: true, // Shows navigation dots below the slider
    infinite: true, // Enables infinite looping of slides
    speed: 300, // Transition speed (in ms)
    slidesToShow: 1, // Number of slides to display at a time
    slidesToScroll: 1, // Number of slides to scroll per click
    autoplay: true, // Enables automatic sliding
    autoplaySpeed: 4000, // Interval between slides in autoplay mode
    arrows: true, // Enables navigation arrows
  };



  return (
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-16">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Media */}
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            <Slider {...sliderSettings}>
              {/* Primary Image */}
              <div>
                <img
                  src={product.picture}
                  alt="Product"
                  className="h-[45vh] w-full object-cover sm:h-[55vh]"
                />
              </div>

              {/* Secondary Image */}
              <div>
                <img
                  src={product.picturesec}
                  alt="Secondary"
                  className="h-[45vh] w-full object-cover sm:h-[55vh]"
                />
              </div>

              {/* Additional Images */}
              {product.additionalPictures &&
                product.additionalPictures.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt={`Additional ${index + 1}`}
                      className="h-[45vh] w-full object-cover sm:h-[55vh]"
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
                    className="h-[45vh] w-full object-cover sm:h-[55vh]"
                  ></video>
                </div>
              )}
            </Slider>
          </div>

          {/* Product Information */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-lg font-bold text-brand-700">
                Gh¢{product.price}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.approved
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {product.approved ? "Approved" : "Not Approved"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  Region
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-ink-800">
                  {product.region || "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  Town
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-ink-800">
                  {product.town || "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  Views
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-ink-800">
                  {product.views}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-600">
              {product.description || "No description available."}
            </p>

            <div className="mt-6 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <p className="flex justify-between">
                <span className="text-ink-400">Location</span>
                <span className="font-semibold text-ink-800">{product.location}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-ink-400">Phone</span>
                <span className="font-semibold text-ink-800">{product.phone}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-ink-400">WhatsApp</span>
                <span className="font-semibold text-ink-800">{product.whatsapp}</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BuildingDetail;
