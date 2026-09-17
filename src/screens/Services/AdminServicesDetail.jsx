import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import baseURL from "../../assets/baseURL";
import Container from "../../components/ui/Container";
import Loader from "../../components/Loader";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdminServicesDetail = () => {
  const { id } = useParams(); // Fetch the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}services/${id}`);
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
    speed: 400, // Transition speed (in ms)
    slidesToShow: 1, // Number of slides to display at a time
    slidesToScroll: 1, // Number of slides to scroll per click
    autoplay: true, // Enables automatic sliding
    autoplaySpeed: 4000, // Interval between slides in autoplay mode
    arrows: true, // Enables navigation arrows
  };

  const infoRows = [
    { label: "Region", value: product.region || "N/A" },
    { label: "Town", value: product.town || "N/A" },
    { label: "Location", value: product.location || "N/A" },
    { label: "Views", value: product.views ?? "0" },
    { label: "Phone", value: product.phone || "N/A" },
    { label: "WhatsApp", value: product.whatsapp || "N/A" },
  ];

  return (
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-12">
      <Container>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Admin &middot; Service listing
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Media */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-card">
              <Slider {...sliderSettings} className="overflow-hidden rounded-xl">
                {/* Primary Image */}
                <div>
                  <img
                    src={product.picture}
                    alt="Product"
                    className="h-[50vh] w-full rounded-xl object-cover"
                  />
                </div>

                {/* Secondary Image */}
                <div>
                  <img
                    src={product.picturesec}
                    alt="Secondary"
                    className="h-[50vh] w-full rounded-xl object-cover"
                  />
                </div>

                {/* Additional Images */}
                {product.additionalPictures &&
                  product.additionalPictures.map((url, index) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`Additional ${index + 1}`}
                        className="h-[50vh] w-full rounded-xl object-cover"
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
                      className="h-[50vh] w-full rounded-xl object-cover"
                    ></video>
                  </div>
                )}
              </Slider>
            </div>
          </div>

          {/* Info card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  Listing details
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    product.approved
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {product.approved ? "Approved" : "Not approved"}
                </span>
              </div>

              <dl className="divide-y divide-ink-100">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm font-medium text-ink-500">{row.label}</dt>
                    <dd className="text-sm font-semibold text-ink-900">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 border-t border-ink-100 pt-4">
                <p className="text-sm font-medium text-ink-500">Description</p>
                <p className="mt-1 text-sm text-ink-700">{product.description || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminServicesDetail;
