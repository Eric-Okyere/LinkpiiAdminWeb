import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import baseURL from "../../assets/baseURL";
import Loader from "../../components/Loader";
import Container from "../../components/ui/Container";
import ListingCard from "../../components/ui/ListingCard";
import EmptyState from "../../components/ui/EmptyState";

// Maps each backend "Saved" category name (see farmbackend routes/Saved.js)
// to the customer-facing detail route that actually renders that category,
// plus a friendly section label. Mechanics and Food are intentionally left
// out - there is no customer-facing detail page for either category yet,
// so a saved item there has nowhere to link to.
const CATEGORY_ROUTES = {
  Products: { label: "Farm & Agric Produce", path: "/agricdetail" },
  Cars: { label: "Cars", path: "/calldriver" },
  Okada: { label: "Okada & Delivery", path: "/calldelivery" },
  Rentcar: { label: "Car Hire", path: "/hiredetail" },
  Newmech: { label: "Mechanics", path: "/callmechanics" },
  Fashion: { label: "Fashion", path: "/detail" },
  Services: { label: "Services", path: "/servicesdetail" },
  Shops: { label: "Shops", path: "/shopdetail" },
  Building: { label: "Housing & Buildings", path: "/buildingdetail" },
  Equipments: { label: "Equipment", path: "/equipmentdetail" },
  Spareparts: { label: "Spare Parts", path: "/sparepart" },
};

const SavedItems = () => {
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`${baseURL}saved/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data.success) {
          const withRoutes = (data.results || [])
            .map((r) => ({ ...r, route: CATEGORY_ROUTES[r.category] }))
            .filter((r) => r.route && r.items && r.items.length > 0);
          setSections(withRoutes);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<FiHeart className="text-2xl" />}
          title="Log in to see your saved items"
          subtitle="Create an account or log in to start saving listings you're interested in."
        />
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/loginform")}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Log in
          </button>
        </div>
      </Container>
    );
  }

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <FiHeart className="text-xl text-brand-600" />
        <h1 className="font-display text-2xl font-bold text-ink-900">My Saved Items</h1>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState
          title="Couldn't load your saved items"
          subtitle="Please check your connection and try again."
        />
      ) : totalItems === 0 ? (
        <EmptyState
          icon={<FiHeart className="text-2xl" />}
          title="Nothing saved yet"
          subtitle="Tap the Save button on any listing to find it here later."
        />
      ) : (
        sections.map(({ category, items, route }) => (
          <div key={category} className="mb-10">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-800">
              {route.label}
              <span className="ml-2 text-sm font-normal text-ink-400">({items.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <ListingCard
                  key={item._id}
                  href={`${route.path}/${item._id}`}
                  image={item.picture}
                  title={item.name}
                  price={item.price ? `Gh¢${item.price}` : undefined}
                  meta={[item.region, item.town, item.location].filter(Boolean).join(", ")}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default SavedItems;
