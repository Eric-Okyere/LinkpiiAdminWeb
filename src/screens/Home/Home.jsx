import React, { useState, useEffect, useRef, useMemo } from 'react';
import baseURL from '../../assets/baseURL';
import { FaPhoneAlt, FaWhatsappSquare, FaTimes } from 'react-icons/fa';
import { FiHeadphones } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import axios from 'axios';
import PhoneInput from "react-phone-input-2";
import Container from '../../components/ui/Container';
import BigCarousel from '../../components/ui/BigCarousel';
import SearchBar from '../../components/ui/SearchBar';
import ListingCard from '../../components/ui/ListingCard';
import EmptyState from '../../components/ui/EmptyState';

const categoryFilters = [
  { key: "all", label: "Everything" },
  { key: "fashion", label: "Products" },
  { key: "shop", label: "Shops" },
  { key: "building", label: "Housing" },
];

function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleNum, setIsModalVisibleNum] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const UserState = useSelector((state) => state);
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRegion, setActiveRegion] = useState("all");
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', gender: '' });
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);


  // fetch user data
  const fetchUserData = async () => {
    try {

       if (!UserState?.user?.id) {
      console.warn("No user ID found, skipping fetchUserData");
      return;
    }


      const response = await axios.get(`${baseURL}userbyid/${UserState.user.id}`);
      const data = response.data;
      setUserData({ name: data.name, email: data.email, phone: data.phone, gender: data.gender || '' });
      if (data.report) {
        navigate('/report');
        return;
      }

       if (!data.phone) {
      setIsModalVisibleNum(true);
      return;
    }
      await updateLastSeen();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  useEffect(() => {
    fetchUserData();
  }, [UserState.user, navigate]);

  // fetch adverts & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const advertResponse = await fetch(`${baseURL}advert`);
        const adverts = await advertResponse.json();

        const [fashion, building, shop] = await Promise.all([
          fetch(`${baseURL}fashionpost/hot`).then(res => res.json()),
          fetch(`${baseURL}buildings/hot/building`).then(res => res.json()),
          fetch(`${baseURL}shops/hot/shops`).then(res => res.json()),
        ]);

        const combined = [
          ...fashion.map(p => ({ ...p, type: "fashion" })),
          ...building.map(p => ({ ...p, type: "building" })),
          ...shop.map(p => ({ ...p, type: "shop" })),
        ];

        setProducts(combined);
        setItems(adverts);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [UserState.user?.id]);

  // Distinct regions present in the loaded listings, for the region filter.
  const regions = useMemo(
    () => Array.from(new Set(products.map((p) => p.region).filter(Boolean))).sort(),
    [products]
  );

  // Apply the search box + category/region filters client-side to the
  // already-loaded "hot"/featured items shown on the homepage.
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.type === activeCategory;
      const matchesRegion = activeRegion === "all" || product.region === activeRegion;
      const matchesSearch = !term || (product.name || "").toLowerCase().includes(term);
      return matchesCategory && matchesRegion && matchesSearch;
    });
  }, [products, searchTerm, activeCategory, activeRegion]);

  // Re-split the filtered results into masonry columns whenever the filters
  // (or the underlying data) change.
  useEffect(() => {
    const numCols = 5;
    const colArray = Array.from({ length: numCols }, () => []);
    filteredProducts.forEach((product, i) => {
      colArray[i % numCols].push(product);
    });
    setColumns(colArray);
  }, [filteredProducts]);

  // increment platfUsed
  useEffect(() => {
    const incrementPlatfUsed = async () => {
      try {
        await axios.get(`${baseURL}user/${UserState.user.id}/platused`);
      } catch (error) {
        console.error("❌ Failed to increment platfUsed:", error.message);
      }
    };
    if (UserState?.user?.id) incrementPlatfUsed();
  }, [UserState.user?.id]);

  const images = items.map((item) => item.picture).filter(Boolean);

const handleProductClick = async (product) => {
  if (UserState.login === false) {
    navigate("/loginform");
    return;
  }

  try {
    let url = "";

    if (product.type === "fashion") {
      url = `${baseURL}fashionpost/products/${product._id}`;
    } else if (product.type === "building") {
      url = `${baseURL}buildings/products/${product._id}`;
    } else if (product.type === "shop") {
      url = `${baseURL}shops/products/${product._id}`;
    } else {
      console.warn("Unknown product type:", product.type);
      return;
    }

    const response = await axios.get(url);
    const fullProductData = response.data;

    // ✅ Pass full product data to detail page
    navigate(`/detail/${product.type}/${product._id}`, { state: { ...fullProductData } });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};


  // 👉 opens modal for active advert
  const handlePressCallButton = () => {
    if (swiperRef.current?.swiper) {
      const activeIndex = swiperRef.current.swiper.activeIndex;
      const item = items[activeIndex];
      if (item) {
        setSelectedItem(item);
        setIsModalVisible(true);
      }
    }
  };

  const updateLastSeen = async () => {
    try {
      await axios.put(`${baseURL}${UserState.user.id}/lastseen`);
    } catch (error) {
      console.error('Failed to update lastSeen:', error);
    }
  };

  const openDialAdvert = async () => {
    if (!selectedItem) return;
    try {
      await fetch(`${baseURL}call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: selectedItem.phone,
          recname: selectedItem.name,
          pagename: "Advert Website",
        }),
      });
      if (selectedItem?.phone) window.location.href = `tel:${selectedItem.phone}`;
    } catch (error) {
      console.error("Error sending user info for call:", error);
    }
    setIsModalVisible(false);
  };

  const WhatsApp = async () => {
    if (!selectedItem) return;
    try {
      await fetch(`${baseURL}whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: selectedItem.phone,
          recname: selectedItem.name,
          pagename: "Advert Website",
        }),
      });
      openWhatsApp();
    } catch (error) {
      console.error("Error sending user info for WhatsApp:", error);
    }
  };

  const openWhatsApp = () => {
    if (!selectedItem?.whatsapp) return;
    const encodedMessage = encodeURIComponent(
      `Hello ${selectedItem.name}, I saw your advertisement on Linkpii. Can I get more info?`
    );
    const whatsappURL = `https://wa.me/${selectedItem.whatsapp}?text=${encodedMessage}`;
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = whatsappURL;
    } else {
      window.open(whatsappURL, "_blank");
    }
    setIsModalVisible(false);
  };

  const openOfficeWhatsapp = () => {
    const url = "https://wa.me/233209317581";
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) window.location.href = url;
    else window.open(url, "_blank");
    setIsSupportModalVisible(false);
  };

  const openOfficeCall = () => {
    window.location.href = "tel:+233209317581";
    setIsSupportModalVisible(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-ink-50">
        <Loader />
      </div>
    );
  }

 const handleSaveUserData = async () => {
  try {
    const payload = { ...userData };
     const response = await axios.put(`${baseURL}card/${UserState.user.id}/details`, payload);
    if (response.status === 200) {
      // ✅ Success: close modal
      setIsModalVisibleNum(false);

      // Trust what the server actually persisted rather than the client's
      // own payload, so the UI can't drift from the database.
      const savedUser = response.data?.user;
      setUserData((prev) => ({
        name: savedUser?.name ?? prev.name,
        email: savedUser?.email ?? prev.email,
        phone: savedUser?.phone ?? prev.phone,
        gender: savedUser?.gender ?? '',
      }));
    }

  } catch (err) {
    console.error("Error saving user data", err);
    alert("We couldn't save your details. Please check your connection and try again.");
  }
};

  return (
    <div className="min-h-screen bg-ink-50 pt-16 sm:pt-20 pb-10">
      {/* Page hero */}
      <div className="bg-ink-950 pb-10 pt-6 sm:pb-14 sm:pt-8">
        <Container>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-300">
                Ghana&apos;s marketplace
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                Buy, sell &amp; rent anything near you
              </h1>
            </div>

            {/* Linkpii Support — for advertisers who want their flyer
                posted in the big carousel below; either icon opens the
                same support sheet with both contact options. */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSupportModalVisible(true)}
                aria-label="Chat with Linkpii Support on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-green-400 transition-colors hover:bg-white/20"
              >
                <FaWhatsappSquare className="text-xl" />
              </button>
              <button
                type="button"
                onClick={() => setIsSupportModalVisible(true)}
                aria-label="Call Linkpii Support"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <FaPhoneAlt className="text-base" />
              </button>
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">
            Products, shops, housing, equipment, services and more — all in one place.
          </p>
        </Container>
      </div>

      <Container className="-mt-6 sm:-mt-8">
        {/* Advert Slider */}
        <BigCarousel images={images} onCallPress={handlePressCallButton} swiperRef={swiperRef} />

        <div className="mb-6 mt-3 flex items-center justify-center gap-2 text-sm">
          <span className="text-ink-500">Want your flyer featured here?</span>
          <button
            onClick={() => setIsSupportModalVisible(true)}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Contact Linkpii Support
          </button>
        </div>

        {/* Search + filters — sit just above the product grid they filter */}
        <div className="mb-6">
          <SearchBar
            keyword={searchTerm}
            onKeywordChange={setSearchTerm}
            keywordPlaceholder="Search listings by name..."
            onClear={() => setSearchTerm("")}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                aria-pressed={activeCategory === cat.key}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  activeCategory === cat.key
                    ? "bg-accent-500 text-white shadow-soft"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {regions.length > 0 && (
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                aria-label="Filter by region"
                className="ml-auto rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:text-sm"
              >
                <option value="all">All regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No listings match your search"
            subtitle="Try a different keyword, category or region."
          />
        ) : isSafari ? (
          // Safari → GRID
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-10">
            {filteredProducts.map((product) => (
              <ListingCard
                key={product._id}
                onClick={() => handleProductClick(product)}
                image={product.picture || fallbackImage}
                title={product.name}
                price={product.price ? `Gh¢${product.price}` : undefined}
                meta={[product.region, product.town, product.location].filter(Boolean).join(", ")}
                badge={product.discount ? `${product.discount}% OFF` : null}
                tag={product.condition}
              />
            ))}
          </div>
        ) : (
          // Others → Masonry
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 mb-10">
            {columns.map((col, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-4">
                {col.map((product) => (
                  <div key={product._id} className="mb-1 break-inside-avoid">
                    <ListingCard
                      onClick={() => handleProductClick(product)}
                      image={product.picture || fallbackImage}
                      title={product.name}
                      price={product.price ? `Gh¢${product.price}` : undefined}
                      meta={[product.region, product.town, product.location].filter(Boolean).join(", ")}
                      badge={product.discount ? `${product.discount}% OFF` : null}
                      tag={product.condition}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Modal */}
      {isModalVisible && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <p className="text-lg font-bold text-ink-800">
                Welcome to {selectedItem?.name}, feel free to call or chat with us.
              </p>
              <button
                onClick={() => setIsModalVisible(false)}
                className="shrink-0 rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-800"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={openDialAdvert}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100"
                aria-label="Call"
              >
                <FaPhoneAlt size={22} />
              </button>
              <button
                onClick={WhatsApp}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
                aria-label="WhatsApp"
              >
                <FaWhatsappSquare size={26} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Linkpii Support — reach the office to get a flyer posted as an
          advertisement in the big carousel above. */}
      {isSupportModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <FiHeadphones className="text-2xl" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink-900">Linkpii Support</h2>
            <p className="mt-1 text-sm text-ink-500">
              Want your flyer featured in the carousel? How can we help you?
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={openOfficeWhatsapp}
                className="flex w-full items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm font-semibold text-ink-800 transition-colors hover:bg-green-50"
              >
                <FaWhatsappSquare className="shrink-0 text-xl text-green-500" />
                Chat on WhatsApp
              </button>
              <button
                onClick={openOfficeCall}
                className="flex w-full items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm font-semibold text-ink-800 transition-colors hover:bg-brand-50"
              >
                <FaPhoneAlt className="shrink-0 text-lg text-brand-600" />
                Direct Call
              </button>
            </div>

            <button
              onClick={() => setIsSupportModalVisible(false)}
              className="mt-5 text-sm font-semibold text-ink-400 hover:text-ink-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isModalVisibleNum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-center text-lg font-semibold text-ink-900">
              Complete Your Profile
            </h2>
            <p className="mb-4 text-center text-sm text-ink-500">
              We need your phone number to continue. You can also let us know your gender.
            </p>

            {/* Phone input with country selector */}
            <PhoneInput
              country={"gh"} // default Ghana 🇬🇭
              value={userData.phone}
              onChange={(phone) => {
                // If phone starts with +countryCode followed by 0, strip the 0
                const countryCode = "+" + phone.split(" ")[0]; // e.g. +233
                let cleaned = phone;

                if (cleaned.startsWith(countryCode + "0")) {
                  cleaned = countryCode + cleaned.slice(countryCode.length + 1);
                }

                // Functional update: react-phone-input-2 can re-fire onChange
                // with its own stale value (e.g. on blur or country-flag
                // clicks) well after the user has already picked a gender.
                // Spreading the `userData` closure captured at that earlier
                // render would silently wipe the gender back out, so we
                // always merge onto the latest state instead.
                setUserData((prev) => ({ ...prev, phone: cleaned }));
              }}
              inputClass="!w-full !h-11 !text-base !rounded-xl !border !border-ink-200 focus:!ring-2 focus:!ring-brand-200"
              containerClass="mb-4"
            />

            {/* Gender select */}
            <select
              value={userData.gender}
              onChange={(e) => {
                const gender = e.target.value;
                setUserData((prev) => ({ ...prev, gender }));
              }}
              className="mb-4 w-full rounded-xl border border-ink-200 p-2.5 text-base text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">Select gender (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <button
              onClick={handleSaveUserData}
              className="w-full rounded-xl bg-brand-600 py-2.5 font-bold text-white transition-colors hover:bg-brand-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
