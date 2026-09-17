import PropTypes from "prop-types";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import { FiPhoneCall, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// The big, edge-to-edge business-partner flyer carousel for the homepage.
// Large on every breakpoint (a real hero, not a thumbnail strip), autoplays,
// and surfaces a call-to-action over whichever flyer is active.
const BigCarousel = ({ images, onCallPress, swiperRef: externalRef }) => {
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;

  if (!images || images.length === 0) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card bg-ink-900">
      <Swiper
        ref={ref}
        modules={[Pagination, Navigation, Autoplay, EffectFade]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={images.length > 1}
        pagination={{ clickable: true }}
        navigation={
          images.length > 1
            ? { nextEl: ".bc-next", prevEl: ".bc-prev" }
            : false
        }
        className="w-full h-[38vh] sm:h-[46vh] md:h-[56vh] lg:h-[64vh]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image}
                alt={`Business partner flyer ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous flyer"
            className="bc-prev hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-ink-800 shadow-soft"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button
            type="button"
            aria-label="Next flyer"
            className="bc-next hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-ink-800 shadow-soft"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 pointer-events-none">
        <div className="pointer-events-none">
          <p className="text-white/80 text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
            Featured partner
          </p>
          <p className="text-white text-sm sm:text-base font-bold">
            Want your flyer here? Send it to our office.
          </p>
        </div>
        <button
          type="button"
          onClick={onCallPress}
          className="pointer-events-auto shrink-0 flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-glow animate-heartbeat"
        >
          <FiPhoneCall />
          Call now
        </button>
      </div>
    </div>
  );
};

BigCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  onCallPress: PropTypes.func,
  swiperRef: PropTypes.object,
};

export default BigCarousel;
