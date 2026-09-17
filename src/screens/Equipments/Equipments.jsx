import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle, AiOutlineVideoCamera } from "react-icons/ai";
import baseURL from "../../assets/baseURL";

const Equipments = ({ item }) => {
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const login = useSelector((state) => state);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setVideo(item.video);
      setPhone(item.phone);
      setPrice(item.price);
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setPicture(item.picture);
      setPicturesec(item.picturesec);
      setLocation(item.location);
      setWhatsapp(item.whatsapp);
      setCondition(item.condition);
    }

    fetch(`${baseURL}equipmentcat`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [item]);

  const handleImageChange = (setImage) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || !price || !description || !location) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);

    // Implement form submission logic here
    setIsLoading(false);
  };

  const inputClass =
    "w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <div className="min-h-screen bg-ink-50 pt-20 pb-16 sm:pt-24">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Equipment</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Post your equipment
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Give buyers the details they need to reach out.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          {/* Media */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="relative">
              <img
                src={picture || "https://via.placeholder.com/200x150?text=Primary"}
                alt="Primary"
                className="h-24 w-full rounded-xl border border-ink-100 object-cover"
              />
              <label
                htmlFor="primaryImage"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft"
              >
                <AiOutlinePlusCircle size={18} />
              </label>
              <input
                type="file"
                id="primaryImage"
                className="hidden"
                onChange={handleImageChange(setPicture)}
              />
            </div>
            <div className="relative">
              <img
                src={picturesec || "https://via.placeholder.com/200x150?text=Secondary"}
                alt="Secondary"
                className="h-24 w-full rounded-xl border border-ink-100 object-cover"
              />
              <label
                htmlFor="secondaryImage"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft"
              >
                <AiOutlinePlusCircle size={18} />
              </label>
              <input
                type="file"
                id="secondaryImage"
                className="hidden"
                onChange={handleImageChange(setPicturesec)}
              />
            </div>
            <div className="relative">
              <video
                src={video}
                controls
                className="h-24 w-full rounded-xl border border-ink-100 bg-ink-100 object-cover"
              ></video>
              <label
                htmlFor="videoPicker"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white shadow-soft"
              >
                <AiOutlineVideoCamera size={18} />
              </label>
              <input
                type="file"
                id="videoPicker"
                className="hidden"
                accept="video/*"
                onChange={handleImageChange(setVideo)}
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className={inputClass}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className={inputClass}
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className={inputClass}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
              rows={4}
              className={inputClass}
            ></textarea>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Region"
                className={inputClass}
              />
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="Town"
                className={inputClass}
              />
            </div>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp Number"
              className={inputClass}
            />
            {/* <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select> */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipments;
